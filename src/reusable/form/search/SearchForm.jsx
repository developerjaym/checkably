import "./SearchForm.css";

export default function SearchForm({onSearch, ariaLabel}) {

    return (<form
        className="search"
        role="search"
        aria-label={ariaLabel}
        onSubmit={onSearch}
      >
        <label className="label search__label">
          <span className="label__text">🔍</span>
          <input className="input input--search" type="search" name="term" />
        </label>
      </form>)
}