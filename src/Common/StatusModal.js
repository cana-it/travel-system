import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';

const options = [
  { value: 1, label: 'Trong tiến trình', color: '#007bff' },
  { value: 2, label: 'Hoàn thành', color: '#28a745' },
  { value: 4, label: 'Quá hạn', color: '#dc3545' },
  { value: 5, label: 'Báo cáo', color: '#ffc107' }
];


const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.data.color,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.data.color,
  })
};

const StatusModalComp = ({ show, handleClose, value, onChange,handleSave,TaskId }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Chọn trạng thái</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Select
        value={options.find(option => option.value === value.value)}
        onChange={onChange}
        options={options}
        styles={customStyles}
        isSearchable
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Đóng
      </Button>
      <Button variant="primary" onClick={() => {
        handleSave(TaskId)
      }}>
        Lưu thay đổi
      </Button>
    </Modal.Footer>
  </Modal>
);

export const StatusModal = React.memo(StatusModalComp)
