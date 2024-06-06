import SvgIcon from "@mui/material/SvgIcon";

// ----------------------------------------------------------------------
function SortIcon(props) {
    return (
        <SvgIcon
            {...props}
            viewBox="0 -6 13 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g id="Group 1293">
                <path id="Vector 369 (Stroke)" fillRule="evenodd" clipRule="evenodd"
                      d="M5.74033 6.89962C5.9809 7.14019 6.37093 7.14019 6.61149 6.89962L11.5395 1.97157C11.7801 1.73101 11.7801 1.34097 11.5395 1.10041C11.299 0.859841 10.9089 0.859841 10.6684 1.10041L5.74033 6.02846C5.49976 6.26902 5.49976 6.65906 5.74033 6.89962Z"
                      fill="#7C878E"/>
                <path id="Vector 370 (Stroke)" fillRule="evenodd" clipRule="evenodd"
                      d="M0.700414 1.10041C0.459848 1.34097 0.459848 1.73101 0.700414 1.97157L5.62847 6.89962C5.86903 7.14019 6.25906 7.14019 6.49963 6.89962C6.7402 6.65906 6.7402 6.26902 6.49963 6.02846L1.57158 1.10041C1.33101 0.859842 0.940979 0.859842 0.700414 1.10041Z"
                      fill="#7C878E"/>
            </g>
        </SvgIcon>
    );
}

// export default function Select(theme) {
//   return {
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "red",
//           "& .MuiOutlinedInputRoot": {
//             borderRadius: 10,
//             height: "2.375rem",
//             "&:hover": {
//               fieldset: {
//                 border: "1px solid #0696D6",
//                 boxShadow: "0px 0px 4px rgba(0, 150, 214, 0.25)",
//               },
//             },
//             "&.Mui-focused": {
//               fieldset: {
//                 border: "1px solid #0696D6",
//                 boxShadow: "none",
//                 outline: "none",
//               },
//             },
//           },
//         },
//       },
//     },
//   };
// }

// ----------------------------------------------------------------------

export default function Select() {
    return {
        MuiSelect: {
            defaultProps: {
                IconComponent: SortIcon,
            },

            styleOverrides: {
                root: {},
            },
        },
    };
}
