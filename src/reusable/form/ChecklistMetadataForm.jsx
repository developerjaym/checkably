import "./ChecklistMetadataForm.css";
import { checklistValidationRules } from "../../services/validators/checklistValidator";
import arrayifyTags from "../../utility/arrayifyTags";

export default function ChecklistMetadataForm({
  defaultValues = { title: "", tags: [], description: "" },
  onSubmit,
  children,
  formRef
}) {
  const presubmit = (e) => {
    e.preventDefault();
    const newChecklistData = Object.fromEntries(new FormData(e.target));
    e.target.reset();
    newChecklistData.tags = arrayifyTags(newChecklistData.tags);
    onSubmit(newChecklistData);
  };

  return (
    <form className="form" onSubmit={presubmit} ref={formRef}>
      <label className="label">
        <span className="label__text">Checklist Title</span>
        <input
          className="input"
          type="text"
          name="title"
          maxLength={checklistValidationRules.title.maxLength}
          minLength={checklistValidationRules.title.minLength}
          required={checklistValidationRules.title.required}
          defaultValue={defaultValues.title}
        />
      </label>
      <label className="label">
        <span className="label__text">Tags (comma-separated list)</span>
        <input
          className="input"
          type="text"
          name="tags"
          maxLength={checklistValidationRules.tags.maxLength}
          minLength={checklistValidationRules.tags.minLength}
          required={checklistValidationRules.tags.required}
          defaultValue={defaultValues.tags.join(",")}
        />
      </label>
      <label className="label">
        <span className="label__text">Description</span>
        <textarea
          className="input"
          name="description"
          maxLength={checklistValidationRules.description.maxLength}
          minLength={checklistValidationRules.description.minLength}
          required={checklistValidationRules.description.required}
          defaultValue={defaultValues.description}
        />
      </label>
      <div className="checklist-form__buttons">{children}</div>
    </form>
  );
}
