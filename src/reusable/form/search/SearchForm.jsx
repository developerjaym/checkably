import { useRef, useState } from "react";
import icons from "../../../icons/Icons";
import Icon from "../../icon/Icon";
import "./SearchForm.css";
import { datetimeMaker, ticker } from "../../../utility/Ticker";

export default function SearchForm({
  onSearch,
  ariaLabel,
  additionalParameters = {},
}) {
  const [searchQuery, setSearchQuery] = useState({ term: "" });
  const [tickerId, setTickerId] = useState(null);
  const formRef = useRef(null);

  const onSubmit = (e) => {
    // if user hits enter, cancel any scheduled callback, call the callback
    e.preventDefault();
    ticker.cancelTask(tickerId);
    onSearch({
      ...additionalParameters,
      ...Object.fromEntries(new FormData(e.target)),
    });
  };
  const onChange = (key, newValue) => {
    // if user has typed something, cancel any existing scheduled callback, schedule the callback in x milliseconds
    setSearchQuery({ ...searchQuery, [key]: newValue });
    ticker.cancelTask(tickerId);
    const taskId = ticker.push(() => {
      onSearch({
        ...additionalParameters,
        ...Object.fromEntries(new FormData(formRef.current)),
      });
    }, datetimeMaker(100));
    setTickerId(taskId);
  };
  return (
    <form
      className="search"
      role="search"
      aria-label={ariaLabel}
      onSubmit={onSubmit}
      ref={formRef}
    >
      <label className="label search__label">
        <Icon icon={icons.search} className="button__icon" />
        <input
          className="input input--search"
          type="search"
          name="term"
          value={searchQuery.term}
          onChange={(e) => onChange("term", e.target.value)}
        />
      </label>
    </form>
  );
}
