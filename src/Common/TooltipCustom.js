import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const TooltipCustom = ({ content, children }) => {
  return (
    <>
      <OverlayTrigger
        key={"top"}
        placement={"top"}
        overlay={
          content !== "" ? (
            <Tooltip id={`tooltip-top`}>{content}</Tooltip>
          ) : (
            <></>
          )
        }
      >
        {children}
      </OverlayTrigger>
    </>
  );
};
