import ReactDOM from 'react-dom';

const ModalAdd = ({ show, onCloseButtonClick, addChannel }) => {

  if (!show) {
    return null;
  }
  console.log('show')
  return ReactDOM.createPortal(
    <>
      <div className="fade modal-backdrop show"></div>
      <div
        className="fade modal show"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addChannelModalLabel"
        aria-hidden="true"
        style={{ display: 'block' }}
        autoFocus
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Добавить канал</div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onCloseButtonClick}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={addChannel}>
                <div>
                  <input
                    name="name"
                    id="name"
                    className="mb-2 form-control"
                    defaultValue=""
                  />
                  <label className="visually-hidden" htmlFor="name">
                    Имя канала
                  </label>
                  <div className="invalid-feedback" />
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                      onClick={onCloseButtonClick}
                    >
                      Отменить
                    </button>
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Отправить
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
    , document.body
  );
};

export { ModalAdd };
