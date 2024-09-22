import React, { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch } from "react-redux";
import { IMAGES_DOMAIN, EDITOR_API_KEY } from "../../Services";
import { mainAction } from "../../Redux/Actions";

const MyEditorCompo = ({
  onChange = () => {},
  values = "<p></p>",
  height = 400,
  readOnly = false,
  Folder = "Euro_Travel",
}) => {
  const editorRef = useRef();
  const [editorVal, setEditorVal] = useState(values);
  useEffect(() => {
    setEditorVal(values);
  }, [values]);
  const dispatch = useDispatch();

  const handleFileChange = async (inputFiles) => {
    ;
    const formData = new FormData();
    formData.append("Key", Folder);
    for (let i = 0; i < inputFiles.length; i++) {
      formData.append("myFile" + i, inputFiles[i]);
    }
    try {
      const response = await mainAction.API_spCallPostFile(formData, dispatch);
      if (response) {
        let _img = response.Message.replaceAll('"', "");
        let listimage = _img.replace("[", "").replace("]", "");
        return IMAGES_DOMAIN + listimage;
      } else {
        return "Không upload được ảnh";
      }
    } catch (error) {
      console.error("Lỗi:", error);
      return null;
    }
  };

  const editorInit = useMemo(
    () => ({
      selector: "textarea#open-source-plugins",
      plugins:
        " print table preview blocks paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap   autoresize",
      imagetools_cors_hosts: ["picsum.photos"],
      toolbar:
        "formatselect | blocks | table | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak |  emoticons |   preview  print | insertfile image media  link anchor codesample | ltr rtl",
      menubar: false,
      tinycomments_mode: "embedded",
      tinycomments_author: "Author name",
      menubar: false,
      allow_html_in_named_anchor: true,
      image_advtab: true,
      importcss_append: true,
      apply_source_formatting: true,
      forced_root_block: false,
      template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
      template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
      autoresize_bottom_margin: 50,
      max_height: 800,
      min_height: height,
      image_caption: true,
      quickbars_selection_toolbar:
        "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
      noneditable_noneditable_class: "mceNonEditable",
      toolbar_mode: "sliding",
      contextmenu: "link image imagetools table",
      table_default_styles: {
        width: "100% !important",
        borderCollapse: "collapse",
      },
      table_advtab: true,
      table_cell_advtab: true,
      table_row_advtab: true,
      table_class_list: [
        { title: "None", value: "" },
        { title: "Table Strip", value: "table-strip" },
      ],
      content_style:
        "table { border-collapse: collapse;  width: 100% !important;}" +
        "table td, table th { border: 1px solid #ddd; padding: 8px; }" +
        "table tr:nth-child(even){ background-color: #f2f2f2; }" +
        "table th { padding-top: 12px; padding-bottom: 12px; text-align: left;" +
        "background-color: #04AA6D; color: white; }" +
        "img { max-width: 100%; height: auto; }",

      // Kích hoạt việc giữ các inline styles cho bảng

      valid_elements: "*[*]",
      extended_valid_elements: "*[*]",
      file_picker_callback: async function (callback, value, meta) {
        if (meta.filetype === "image") {
          const input = document.getElementById("my-file");
          input.click();
          input.onchange = async function (event) {
            const listimage = await handleFileChange(event.target.files);
            if (listimage) {
              callback(listimage, {
                alt: event.target.files[0]?.name || "",
              });
            }
          };
        }
        /* if (meta.filetype === "media") {
          const input = document.getElementById("my-file");
          input.click();
          input.onchange = async function (event) {
            const listimage = await handleFileChange(event.target.files);
            if (listimage) {
              callback(listimage, {
                alt: event.target.files[0]?.name || "",
              });
            }
          };
        } */
      },
    }),
    [height]
  );

  return (
    <div className="!z-[0]">
      <Editor
        value={editorVal}
        init={editorInit}
        apiKey={EDITOR_API_KEY}
        onEditorChange={(content, editor) => {
          const updatedContent = content.replace(/\\n/g, "");
          setEditorVal(updatedContent);
        }}
        onBlur={(content, editor) => {
          const newValue = editorVal.replaceAll("\n", "").replaceAll('"', "'");
          onChange(newValue);
        }}
        //onInit={(evt, editor) => (editorRef.current = editor)}
      />
      <input
        id="my-file"
        type="file"
        name="my-file"
        style={{ display: "none" }}
        multiple
      />
    </div>
  );
};
export const MyEditor = React.memo(MyEditorCompo);
