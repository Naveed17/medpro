import SvgIcon from "@mui/material/SvgIcon";
// ----------------------------------------------------------------------
function SortIcon(props) {
  return (
    <SvgIcon
      {...props}
      width="13"
      height="26"
      viewBox="0 0 13 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.91662 9.65768C9.81056 9.77435 9.7045 9.83268 9.54541 9.83268C9.38632 9.83268 9.28026 9.77435 9.1742 9.65768L6.3636 6.56602L3.553 9.65768C3.34088 9.89102 3.0227 9.89102 2.81058 9.65768C2.59846 9.42435 2.59846 9.07435 2.81058 8.84102L5.99239 5.34102C6.20451 5.10768 6.52269 5.10768 6.73481 5.34102L9.91662 8.84102C10.1287 9.07435 10.1287 9.42435 9.91662 9.65768Z"
        fill="black"
      />
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="2"
        y="5"
        width="9"
        height="5"
      >
        <path
          d="M9.91662 9.65768C9.81056 9.77435 9.7045 9.83268 9.54541 9.83268C9.38632 9.83268 9.28026 9.77435 9.1742 9.65768L6.3636 6.56602L3.553 9.65768C3.34088 9.89102 3.0227 9.89102 2.81058 9.65768C2.59846 9.42435 2.59846 9.07435 2.81058 8.84102L5.99239 5.34102C6.20451 5.10768 6.52269 5.10768 6.73481 5.34102L9.91662 8.84102C10.1287 9.07435 10.1287 9.42435 9.91662 9.65768Z"
          fill="white"
        />
      </mask>

      <path
        d="M9.91662 17.1577L6.73481 20.6577C6.62875 20.7743 6.52269 20.8327 6.3636 20.8327C6.20451 20.8327 6.09845 20.7743 5.99239 20.6577L2.81058 17.1577C2.59846 16.9243 2.59846 16.5743 2.81058 16.341C3.0227 16.1077 3.34088 16.1077 3.553 16.341L6.3636 19.4327L9.1742 16.341C9.38632 16.1077 9.7045 16.1077 9.91662 16.341C10.1287 16.5743 10.1287 16.9243 9.91662 17.1577Z"
        fill="black"
      />
      <mask
        id="mask1"
        maskUnits="userSpaceOnUse"
        x="2"
        y="16"
        width="9"
        height="5"
      >
        <path
          d="M9.91662 17.1577L6.73481 20.6577C6.62875 20.7743 6.52269 20.8327 6.3636 20.8327C6.20451 20.8327 6.09845 20.7743 5.99239 20.6577L2.81058 17.1577C2.59846 16.9243 2.59846 16.5743 2.81058 16.341C3.0227 16.1077 3.34088 16.1077 3.553 16.341L6.3636 19.4327L9.1742 16.341C9.38632 16.1077 9.7045 16.1077 9.91662 16.341C10.1287 16.5743 10.1287 16.9243 9.91662 17.1577Z"
          fill="white"
        />
      </mask>
    </SvgIcon>
  );
}

// export default function Select(theme) {
//   return {
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "red",
//           "& .MuiOutlinedInput-root": {
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
