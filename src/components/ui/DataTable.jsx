import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function DataTable({
    columns,
    data = [],
    searchKeys = [],
    rowsPerPageOptions = [10, 25, 50],
    actions,
    emptyText = 'No hay registros',
}) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(rowsPerPageOptions[0]);

    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter(row =>
            searchKeys.some(key => String(row[key] ?? '').toLowerCase().includes(q))
        );
    }, [data, search, searchKeys]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage = Math.min(page, totalPages);
    const rows = filtered.slice((safePage - 1) * perPage, safePage * perPage);

    const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

    return (
        <div>
            {/* Toolbar */}
            <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div className="search-bar">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                    <span className="text-xs text-muted">{filtered.length} registros</span>
                    <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        value={perPage}
                        onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                    >
                        {rowsPerPageOptions.map(n => <option key={n} value={n}>{n} / página</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(c => <th key={c.key}>{c.label}</th>)}
                            {actions && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)}>
                                    <div className="empty-state">
                                        <p>{emptyText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, i) => (
                                <tr key={row.id ?? i}>
                                    {columns.map(c => (
                                        <td key={c.key}>
                                            {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                                        </td>
                                    ))}
                                    {actions && <td>{actions(row)}</td>}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button className="page-btn" onClick={() => goTo(1)} disabled={safePage === 1}><ChevronsLeft size={14} /></button>
                    <button className="page-btn" onClick={() => goTo(safePage - 1)} disabled={safePage === 1}><ChevronLeft size={14} /></button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                        const p = start + i;
                        return (
                            <button key={p} className={`page-btn ${p === safePage ? 'active' : ''}`} onClick={() => goTo(p)}>{p}</button>
                        );
                    })}
                    <button className="page-btn" onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages}><ChevronRight size={14} /></button>
                    <button className="page-btn" onClick={() => goTo(totalPages)} disabled={safePage === totalPages}><ChevronsRight size={14} /></button>
                </div>
            )}
        </div>
    );
}
