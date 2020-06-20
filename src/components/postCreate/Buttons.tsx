import React from 'react';
import { Send } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

function NewPostButtons({ onClick, disabled }: any) {
  return (
    <React.Fragment>
      <div className="fixed-wrapper-btns create-btns clearfix">
        <div className="container">
          <Button
            disabled={disabled}
            onClick={onClick}
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Send />}
          >
            Publish
          </Button>
          &nbsp; &nbsp;
          <Button disabled={disabled} type="submit" color="primary">
            Save as Draft
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default NewPostButtons;
