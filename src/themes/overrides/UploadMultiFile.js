
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Stack,
} from '@mui/material';
import IconUrl from "@themes/urlIcon";


// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme, styleprops }) => {
  const multi = {
    outline: 'none',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(3.2, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral,
    border: `1px dashed ${theme.palette.grey[500_32]}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' },
    [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
  }
  const single = {
    padding: theme.spacing(2, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    border: `2px solid ${theme.palette.grey["A600"]}`,
    '& svg path': { fill: theme.palette.grey["A600"] },
    '&:hover': { opacity: 0.72, cursor: 'pointer' },
  }
  return Boolean(styleprops) ? single : multi;
});

// ----------------------------------------------------------------------

UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  files: PropTypes.array,
  sx: PropTypes.object,
  onDrop: PropTypes.func,
  singleFile: PropTypes.bool,
};

function UploadMultiFile({ error, files, sx, singleFile, title, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    ...other
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        styleprops={singleFile?.toString()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          })
        }}
      >
        <input {...getInputProps()} />
        {!singleFile ? (
          <Box sx={{ p: 1, }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {title}
            </Typography>
          </Box>
        ) : (
          <Stack alignItems='center'>
            <IconUrl path="ic_upload3" />
            <Typography sx={{ color: 'text.secondary' }}>
              Drag and drop file here or click
            </Typography>
          </Stack>
        )}
      </DropZoneStyle>
    </Box>
  );
}
export default UploadMultiFile;