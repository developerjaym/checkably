export default function clipboardCopier(shareString, onSuccess, onFailure) {
  if (navigator && navigator.clipboard.writeText(shareString)) {
    onSuccess();
  } else {
    onFailure();
  }
}
