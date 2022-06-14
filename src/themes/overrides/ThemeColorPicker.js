import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
const RootStyled = styled(Box)(({ theme }) => ({

}));
export default function ThemeColorPicker({ onSellectColor }) {

    const colors = ['primary', 'secondary', 'error', 'success', 'info', 'warning'];
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [colorCode, setColorCode] = React.useState([]);
    const [selectedColor, setSelectedColor] = React.useState('');
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (prop) => {
        onSellectColor(prop.code)
        setSelectedColor(prop);
        setAnchorEl(null);
    };
    React.useEffect(() => {
        const mainColors = colors.map((color) => {
            return {
                name: color,
                code: theme.palette[color].main
            }
        });
        setColorCode(mainColors);

    }, [])
    return (
        <RootStyled>
            <Button
                id="basic-button"
                color={selectedColor.name}
                variant="contained"
                sx={{height: '38px', minWidth: '43px'}}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}/>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(selectedColor)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {colorCode.map((color) =>
                    <MenuItem key={color.name} onClick={() => handleClose(color)}>
                        <div style={{backgroundColor: color.code, height: 20, width: 20}}/>
                    </MenuItem>
                )}

            </Menu>
        </RootStyled>
    );
}
