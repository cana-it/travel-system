export const ConvertFileName = (filename) => {
  const extension = filename.split(".").pop();
  const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
  const formattedName = nameWithoutExtension
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${formattedName}.${extension}`;
};
