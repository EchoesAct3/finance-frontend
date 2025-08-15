import React, { useState, useMemo } from 'react';
import type { ExpenseData } from '../services/databaseService';

interface ExpenseTableProps {
	data: ExpenseData[];
	loading: boolean;
	error: string | null;
}

const formatCellValue = (column: string, value: unknown): string => {
	if (value === null || value === undefined) return '-';
	const key = column.toLowerCase();

	if (key === 'amount') {
		const num = Number(value);
		return Number.isNaN(num) ? String(value) : num.toLocaleString('en-US');
	}

	if (key === 'payment_date') {
		const s = String(value);
		const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
		return m ? m[1] : s;
	}

	return String(value);
};

const getColumnAlignment = (column: string): string => {
	const key = column.toLowerCase();
	if (key === 'amount') return 'text-right';
	if (key === 'payment_date') return 'text-center';
	return 'text-left';
};

const getIndentStyle = (column: string): React.CSSProperties => {
	const align = getColumnAlignment(column);
	if (align.includes('text-left')) return { paddingLeft: '1rem' };
	if (align.includes('text-right')) return { paddingRight: '1rem' };
	return {};
};

const getCellAlignment = (column: string): string => {
	const key = column.toLowerCase();
	if (key === 'amount') return 'expense-table-cell-right';
	if (key === 'payment_date') return 'expense-table-cell-center';
	return 'expense-table-cell-left';
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ data, loading, error }) => {
	const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; offsetX: number } | null>(null);

	const columns = useMemo(() => {
		if (!data || data.length === 0) return [] as string[];
		// 过滤 SOURCE，并按指定顺序排序
		const raw = Object.keys(data[0]).filter(c => c.toLowerCase() !== 'source');
		const order = ['payment_classification', 'amount', 'payment_date', 'comment'];
		const mapLower = (s: string) => s.toLowerCase();
		const sorted = [...raw].sort((a, b) => {
			const ai = order.indexOf(mapLower(a));
			const bi = order.indexOf(mapLower(b));
			if (ai === -1 && bi === -1) return a.localeCompare(b);
			if (ai === -1) return 1;
			if (bi === -1) return -1;
			return ai - bi;
		});
		return sorted;
	}, [data]);

	// Grid列宽模板
	const gridTemplateColumns = useMemo(() => {
		const templateByKey: Record<string, string> = {
			payment_classification: 'minmax(14rem, 1.2fr)',
			amount: 'minmax(6rem, 0.5fr)',
			payment_date: 'minmax(8rem, 0.7fr)',
			comment: 'minmax(28rem, 3fr)'
		};
		const fallback = 'minmax(10rem, 1fr)';
		return columns
			.map(c => templateByKey[c.toLowerCase()] ?? fallback)
			.join(' ');
	}, [columns]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span className="ml-3 text-gray-600">正在加载数据...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-red-800">加载失败</h3>
						<div className="mt-2 text-sm text-red-700">{error}</div>
					</div>
				</div>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="text-center py-8">
				<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<h3 className="mt-2 text-sm font-medium text-gray-900">暂无数据</h3>
				<p className="mt-1 text-sm text-gray-500">没有找到费用记录</p>
			</div>
		);
	}

	return (
		<div className="expense-table-container">
			{/* 固定表头 */}
			<div className="expense-table-header-fixed">
				<div
					className="expense-table-grid"
				>
					{columns.map((column, index) => (
						<div
							key={column}
							className={`expense-table-header-cell ${getColumnAlignment(column)}`}
							style={{ ...getIndentStyle(column) }}
						>
							{column}
						</div>
					))}
				</div>
			</div>

			{/* 可滚动内容区域 */}
			<div className="expense-table-content-scrollable">
				{data.map((row, rowIndex) => {
					const sourceVal = (row as any)['SOURCE'] ?? (row as any)['source'] ?? (row as any)['Source'];
					const source = typeof sourceVal === 'string' ? sourceVal.toLowerCase() : '';
					const rowClass = source === 'cash' ? 'expense-table-row expense-table-row-cash' : 
									 source === 'digital' ? 'expense-table-row expense-table-row-digital' : 
									 'expense-table-row expense-table-row-default';
					
					return (
						<div
							key={rowIndex}
							className={rowClass}
							style={{ gridTemplateColumns: gridTemplateColumns }}
						>
							{columns.map((column, colIndex) => {
								const isComment = column.toLowerCase() === 'comment';
								const cellValue = formatCellValue(column, (row as any)[column]);
								const cellClass = `expense-table-cell ${getCellAlignment(column)} ${isComment ? 'expense-table-cell-truncate' : ''}`;
								
								return (
									<div
										key={`${rowIndex}-${column}`}
										className={cellClass}
										style={{ ...getIndentStyle(column) }}
										onMouseEnter={(e) => {
											if (isComment) {
												const el = e.currentTarget as HTMLDivElement;
												const isOverflow = el.scrollWidth > el.clientWidth;
												if (isOverflow) {
													const rect = el.getBoundingClientRect();
													setTooltip({ text: cellValue, x: rect.left + rect.width / 2, y: rect.top - 10, offsetX: rect.width / 4 });
												} else {
													setTooltip(null);
												}
											}
										}}
										onMouseLeave={() => { if (isComment) setTooltip(null); }}
									>
										{cellValue}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>

			{/* Tooltip */}
			{tooltip && (() => {
				const left = Math.min(window.innerWidth - 16, tooltip.x + tooltip.offsetX);
				return (
					<div
						className="fixed z-50 px-3 py-2 text-sm text-white bg-black border border-black rounded-md shadow-xl max-w-xl break-words pointer-events-none text-left"
						style={{ left, top: tooltip.y, transform: 'translateY(-100%)', backgroundColor: '#000000', opacity: 1 }}
					>
						{tooltip.text}
						<div className="absolute top-full left-3 transform w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
					</div>
				);
			})()}
		</div>
	);
};
