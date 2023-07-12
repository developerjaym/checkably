import icons from "../../../icons/Icons";
import Icon from "../../icon/Icon";
import "./SearchForm.css";

export default function SearchForm({onSearch, ariaLabel}) {

    return (<form
        className="search"
        role="search"
        aria-label={ariaLabel}
        onSubmit={onSearch}
      >
        <label className="label search__label">
        <Icon icon={icons.search} className="button__icon"/>
          <input className="input input--search" type="search" name="term" />
        </label>
      </form>)
}