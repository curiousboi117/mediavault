export default function Toolbar({ theme, onToggleTheme, filters, onChangeFilters, total }) {
  return (
    <section className="panel toolbar">
      <input
        type="search"
        placeholder="Search by file name"
        value={filters.search}
        onChange={(event) => onChangeFilters({ ...filters, search: event.target.value })}
      />
      <input
        type="date"
        value={filters.from}
        onChange={(event) => onChangeFilters({ ...filters, from: event.target.value })}
      />
      <input
        type="date"
        value={filters.to}
        onChange={(event) => onChangeFilters({ ...filters, to: event.target.value })}
      />
      <button type="button" onClick={onToggleTheme}>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
      <strong>{total} items</strong>
    </section>
  );
}
