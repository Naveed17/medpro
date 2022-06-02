import {
    logout,
    openMenu, ProfileMenuConfig,
    profileMenuSelector,
    ProfileSectionStyled
} from "@features/profilMenu";
import {Box, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Typography} from "@mui/material";
import Icon from "@themes/icon";
import {pxToRem} from "@themes/formatFontSize";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useRef} from "react";
import {useRouter} from "next/router";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";

function ProfilMenu() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { opened } = useAppSelector(profileMenuSelector);
    const dispatch = useAppDispatch();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';
    const anchorRef: any = useRef();

    const { t, ready } = useTranslation('menu');
    if (!ready) return (<>loading translations...</>);

    const handleToggle = () => {
        dispatch(openMenu(!opened));
    };

    const handleMenuItem = (action: string) => {
        switch (action){
            case 'logout': dispatch(logout(dir)); break;
        }
    };

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        dispatch(openMenu(false));
    };

    return(
        <ProfileSectionStyled
            onClick={handleToggle}
            ref={anchorRef}
            id="composition-button"
            aria-controls={opened ? "composition-menu" : undefined}
            aria-expanded={opened ? "true" : undefined}
            aria-haspopup="true">
            <IconButton color="primary" disableRipple size="small" className="profile-btn">
                <Box
                    className="profile-img"
                    component="img"
                    alt="The house from the offer."
                    src="/static/mock-images/avatars/avatar_1.jpg"
                    width={26}
                    height={26}
                />
                <Icon path="ic-menu" />
            </IconButton>
            <Popper
                open={opened}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                className="profile-menu-container">
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: "right top",
                            marginTop: 10,
                            marginRight: -10,
                            zIndex: 1000,
                        }}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={opened}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    className="profile-menu">
                                    <MenuItem disableRipple className="profile-top-sec">
                                        <MenuList>
                                            <MenuItem disableRipple>
                                                <Box
                                                    className="profile-img"
                                                    component="img"
                                                    alt="The house from the offer."
                                                    src="/static/mock-images/avatars/avatar_1.jpg"
                                                    width={pxToRem(46)}
                                                    height={pxToRem(46)}
                                                />
                                                <Box className="profile-detail">
                                                    <Typography variant="body1" className="name">
                                                        {session?.user && (<> Dr { session.user.name} </>)}
                                                    </Typography>
                                                    <Typography variant="body2" className="des">
                                                        Agenda Cabinet
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        </MenuList>
                                    </MenuItem>
                                    {ProfileMenuConfig.map((item: any, index) => (
                                        <MenuItem
                                            key={`menu-${index}`}
                                            onClick={() => handleMenuItem(item.action)}
                                            disableRipple
                                            className={`item-list ${item.name === "Settings" ? "border-bottom" : ""
                                            }${item.hasOwnProperty("items") ? "has-items" : ""}`}>
                                            <IconUrl path={item.icon} />
                                            <Typography variant="body1" className="item-name">
                                                {t("doctor-dropdown." + item.name.toLowerCase())}
                                            </Typography>
                                            {item.hasOwnProperty("items") ? (
                                                <>
                                                    {dir === "rtl" ? <Icon path="ic-retour" /> : <Icon path="ic-flesh-droite" />}
                                                    <MenuList className="sub-items">
                                                        {item.items.map((subItem: any, subIndex: any) => (
                                                            <MenuItem
                                                                key={`sub-${subIndex}`}
                                                                disableRipple
                                                                className={`${item.items.length - 1 === subIndex
                                                                    ? ""
                                                                    : "border-bottom"
                                                                }`}>
                                                                <Icon path={subItem.icon} />
                                                                <Typography
                                                                    variant="body1"
                                                                    className="item-name">
                                                                    {subItem.name}
                                                                </Typography>
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </>
                                            ) : null}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </ProfileSectionStyled>
    )
}
export default ProfilMenu
