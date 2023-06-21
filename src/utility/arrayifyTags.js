export default function arrayifyTags(tagsString) {
    return tagsString.split(",")
    .map((str) => str.trim())
    .filter(Boolean)
    .map((tag) => tag.toUpperCase().trim())
}