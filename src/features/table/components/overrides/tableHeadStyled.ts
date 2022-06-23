import {styled} from "@mui/material/styles";
import TableHead from "@mui/material/TableHead";

 const TableHeadStyled = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-head': {
        paddingTop: '8px !important',
        paddingBottom: '8px !important',
    },
    '& .MuiTableSortLabel-root': {
        '& .MuiTableSortLabel-icon': {
            transform: 'rotate(90deg)',
        }
    }
}));

 export default TableHeadStyled;
