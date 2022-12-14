import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
const CollapseCardStyled = styled(Paper)(({ theme }) => {
    return {
        padding: 8,
        "& .container-circular-progress":{
            position: 'relative',
            display: 'inline-flex',
            marginRight: .8,
            marginLeft: .5,
            cursor: "pointer"
        }
    }
});
export default CollapseCardStyled;
