import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import IconUrl from "@themes/urlIcon";

type Props = {
    droppable?: boolean;
    fileType?: string;
};

export const TypeIcon: React.FC<Props> = (props) => {
    if (props.droppable) {
        return <IconUrl path="ic-folder-with-files" width={20} height={20}/>;
    }

    switch (props.fileType) {
        case "image":
            return <ImageIcon/>;
        case "csv":
            return <ListAltIcon/>;
        case "text":
            return <DescriptionIcon/>;
        default:
            return <DescriptionIcon sx={{width: 18, height: 18}}/>;
    }
};

export default TypeIcon;
