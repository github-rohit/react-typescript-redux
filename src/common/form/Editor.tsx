import React from 'react';
import tinymce from 'tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/skins/lightgray/skin.min.css';
import { InputField } from '../../types/FormInputField';

class Editor extends React.Component<InputField, any> {
  state = { editor: null };

  componentDidMount() {
    tinymce.init({
      selector: `#${this.props.name}`,
      menubar: false,
      branding: false,
      autoresize_bottom_margin: 0,
      autoresize_min_height: 300,
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help autoresize'
      ],
      toolbar:
        'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link image, media | forecolor backcolor | code',

      setup: (editor: tinymce.Editor) => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const value = editor.getContent();
          this.props.onChange({
            currentTarget: {
              value,
              name: this.props.name
            }
          });
        });
      }
    } as any);
  }

  componentWillUnmount() {
    (tinymce as any).remove(this.state.editor);
  }

  render() {
    return <textarea id={this.props.name} {...this.props} />;
  }
}

export default Editor;
