import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const DragAndDropFileComp = ({ fileUpload = [], onFileChange = () => {} }) => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    setFiles(fileUpload);
  }, [fileUpload]);
  return (
    <div className="App">
      <FilePond
        files={files}
        allowReorder={true}
        allowMultiple={true}
        onupdatefiles={(e) => {
          setFiles(e);
          onFileChange(e);
        }}
        style={{backgroundColor:"#fff"}}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
};

export const DragAndDropFile = React.memo(DragAndDropFileComp);
