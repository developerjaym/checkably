import icons from "../../../icons/Icons";
import Icon from "../../icon/Icon";
import "./SearchForm.css";

export default function SearchForm({onSearch, ariaLabel, additionalParameters = {}}) {
    const onSubmit = (e) => {
      e.preventDefault();
      onSearch({...additionalParameters, ...Object.fromEntries(new FormData(e.target))})
    }
    return (<form
        className="search"
        role="search"
        aria-label={ariaLabel}
        onSubmit={onSubmit}
      >
        <label className="label search__label">
        <Icon icon={icons.search} className="button__icon"/>
          <input className="input input--search" type="search" name="term" />
        </label>
      </form>)
}