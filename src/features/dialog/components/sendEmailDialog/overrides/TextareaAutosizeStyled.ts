import {styled} from "@mui/material/styles";
import {TextareaAutosize as BaseTextareaAutosize} from '@mui/material';
import {blue, grey} from "@mui/material/colors";

const TextareaAutosizeStyled = styled(BaseTextareaAutosize)(
    ({theme}) => `
  width: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background: ${theme.palette.grey["A500"]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

export default TextareaAutosizeStyled;
