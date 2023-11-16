// Inspired by the former Facebook spinners.
import Box from '@mui/material/Box';
import CircularProgress, {
    circularProgressClasses
} from '@mui/material/CircularProgress';

function FacebookCircularProgress({...props}) {
    const {children, size = 40, ...rest} = props;

    return (
        <Box sx={{position: 'relative', ...(!children && {height: size})}}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                {...{size}}
                thickness={4}
                {...rest}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                {...{size}}
                thickness={4}
                {...rest}
            />
            {children}
        </Box>
    );
}

export default FacebookCircularProgress;
