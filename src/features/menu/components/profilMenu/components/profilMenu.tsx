import {
    logout,
    openMenu,
    ProfileMenuConfig,
    profileMenuSelector,
    toggleMobileBar,
    ProfileSectionStyled
} from "@features/menu";
import {
    Box,
    ClickAwayListener,
    Grow,
    IconButton,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from "@mui/material";
import Icon from "@themes/icon";
import {pxToRem} from "@themes/formatFontSize";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import React, {useRef, useState} from "react";
import {useRouter} from "next/router";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import axios from "axios";
import {Theme} from "@mui/material/styles";
import {agendaSelector} from "@features/calendar";
import {useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {unsubscribeTopic, useMedicalEntitySuffix} from "@lib/hooks";
import {dashLayoutSelector} from "@features/base";
import Image from "next/image";

function ProfilMenu() {
    const {data: session} = useSession();
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const dispatch = useAppDispatch();
    const anchorRef: any = useRef();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation('menu');
    const {opened} = useAppSelector(profileMenuSelector);
    const {agendas, config} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';
    const [loading, setLoading] = useState<boolean>(false);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>
    const general_information = (user as UserDataResponse).general_information;

    const {trigger: triggerSettingsUpdate} = useRequestQueryMutation("/settings/update");

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    const handleToggle = () => {
        dispatch(openMenu(!opened));
    };

    const switchAgenda = (agenda: AgendaConfigurationModel) => {
        medicalEntityHasUser && triggerSettingsUpdate({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda.uuid}/switch/${router.locale}`
        }, {
            onSuccess: () => {
                setLoading(true);
                router.reload();
            }
        });
    }

    const handleMenuItem = async (action: string) => {
        switch (action) {
            case 'logout':
                await unsubscribeTopic({general_information});
                // Log out from keycloak session
                const {
                    data: {path}
                } = await axios({
                    url: "/api/auth/logout",
                    method: "GET"
                });
                dispatch(logout({redirect: true, path}));
                break;
            case 'profile':
                router.push(isMobile ? "/dashboard/settings" : `/dashboard/settings/${roles.includes('ROLE_SECRETARY') ? "motif" : "profil"}`)
                dispatch(toggleMobileBar(true));
                break;
            case 'rooting':
                window.location.href = "https://www.med.tn/";
                break;
        }
    };

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        dispatch(openMenu(false));
    };

    if (loading) return (<LoadingScreen text={"loading-switch"}/>);

    return (
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
                    alt="Connected user"
                    src={`/static/icons/Med-logo_.svg`}
                    width={26}
                    height={26}
                />
                <Icon path="ic-menu"/>
            </IconButton>
            <Popper
                open={opened}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                className="profile-menu-container">
                {({TransitionProps}) => (
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
                                                    src={`/static/icons/Med-logo_.svg`}
                                                    width={pxToRem(46)}
                                                    height={pxToRem(46)}
                                                />
                                                <Box className="profile-detail">
                                                    <Typography variant="body1" className="name">
                                                        {session?.user && <> {roles.includes('ROLE_SECRETARY') ? "SECRÉTAIRE" : "DR"} {session.user.name?.toUpperCase()} </>}
                                                    </Typography>
                                                    <Typography variant="body2" className="des">
                                                        Agenda {config?.name}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        </MenuList>
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => handleMenuItem("rooting")}
                                        className={`item-list`}
                                        disableRipple>
                                        <Image height={18}
                                               width={18}
                                               alt="company logo"
                                               src="/static/icons/Med-logo_.svg"
                                               priority
                                        />
                                        <Typography variant="body1" className="item-name">
                                            {t("patientSpace")}
                                        </Typography>
                                    </MenuItem>

                                    {ProfileMenuConfig.map((item: any, index) => (
                                        <MenuItem
                                            key={`menu-${index}`}
                                            onClick={() => handleMenuItem(item.action)}
                                            disableRipple
                                            className={`item-list ${item.name === "Settings" ? "border-bottom" : ""
                                            }${item.hasOwnProperty("items") ? "has-items" : ""}`}>
                                            <IconUrl path={item.icon}/>
                                            <Typography variant="body1" className="item-name">
                                                {t("doctor-dropdown." + item.name.toLowerCase())}
                                            </Typography>
                                            {item.hasOwnProperty("items") ? (
                                                <>
                                                    {dir === "rtl" ? <Icon path="ic-retour"/> :
                                                        <Icon path="ic-flesh-droite"/>}
                                                    <MenuList className="sub-items">
                                                        {agendas?.map((subItem: any, subIndex: any) => (subItem.locations[0] &&
                                                            <MenuItem
                                                                onClick={() => switchAgenda(subItem)}
                                                                key={`sub-${subIndex}`}
                                                                selected={subItem.isDefault}
                                                                {...(subIndex !== agendas.length - 1 && {className: "border-bottom"})}>
                                                                <ListItemText>
                                                                    Default
                                                                </ListItemText>
                                                            </MenuItem>
                                                        ))}
                                                        {/*<Link href={"/dashboard/settings/places/new"}>
                                                            <MenuItem>
                                                                <ListItemIcon>
                                                                    <IconUrl path={"ic-plus"}/>
                                                                </ListItemIcon>
                                                                <ListItemText>
                                                                    Ajouter un agenda
                                                                </ListItemText>
                                                            </MenuItem>
                                                        </Link>*/}
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
