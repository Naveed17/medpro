import {Breadcrumbs, Hidden, Toolbar, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {SubHeaderStyled} from "@features/subHeader";
import Link from "@themes/Link";


function SubHeader(){
    const router = useRouter();
    const path = router.asPath.split("/");
    const breadcrumb = path.filter(Boolean);
    return(
        <Hidden
            {...(path[1] === "setting" && path.length < 3 ? { smDown: true } : {})}
        >
            <SubHeaderStyled position="static" color="inherit" className="main-subheader">
                <Toolbar>
                    {breadcrumb.length > 1 ? (
                            <Breadcrumbs
                                className="breadcrumbs"
                                separator=">"
                                aria-label="breadcrumb">
                                {breadcrumb.map((item, index) =>
                                    index !== breadcrumb.length - 1 ? (
                                        <Link
                                            underline="hover"
                                            color="inherit"
                                            href="/"
                                            key={`bread-crump-${index}`}
                                        >
                                            {item}
                                        </Link>
                                    ) : null
                                )}
                                <Typography color="text.primary">
                                    {breadcrumb[breadcrumb.length - 1]}
                                </Typography>
                            </Breadcrumbs>
                        ) : ''}
                </Toolbar>
            </SubHeaderStyled>
        </Hidden>
    );
}
export default  SubHeader;
