import {
    logout,
    openMenu,
    ProfileMenuConfig,
    profileMenuSelector,
    toggleMobileBar,
    ProfileSectionStyled
} from "@features/menu";
import {
    Avatar,
    Box,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper, Stack, ToggleButton, ToggleButtonGroup,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import React, {useRef, useState} from "react";
import {useRouter} from "next/router";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import axios from "axios";
import {useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import {LoadingScreen} from "@features/loadingScreen";
import {ConditionalWrapper, unsubscribeTopic, useMedicalEntitySuffix} from "@lib/hooks";
import {configSelector, dashLayoutSelector, setDirection, setLocalization} from "@features/base";
import Langs from "@features/topNavBar/components/langButton/config";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Can from "@features/casl/can";
import moment from "moment-timezone";

function ProfileMenu() {
    const {data: session, update} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const anchorRef: any = useRef();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation('menu');
    const {opened} = useAppSelector(profileMenuSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {locale} = useAppSelector(configSelector);

    const [loading, setLoading] = useState<boolean>(false);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>
    const general_information = (user as UserDataResponse).general_information;
    const medical_entity = (user as UserDataResponse).medical_entity;
    const medical_entities = ((user as UserDataResponse).medical_entities?.reduce((entites: MedicalEntityModel[], data: any) => [...(entites ?? []), data?.medical_entity], []) ?? []) as MedicalEntityModel[];
    const hasMultiMedicalEntities = medical_entities.length > 1 ?? false;

    const {trigger: triggerSettingsUpdate} = useRequestQueryMutation("/settings/update");

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    const handleToggle = () => {
        dispatch(openMenu(!opened));
    }

    const switchAgenda = (agenda: AgendaConfigurationModel) => {
        medicalEntityHasUser && triggerSettingsUpdate({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agenda.uuid}/switch/${router.locale}`
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
                const {data: {path}} = await axios({
                    url: "/api/auth/logout",
                    method: "GET"
                });
                dispatch(logout({redirect: true, path}));
                break;
            case 'switch-medical-entity':
                await update({
                    default_medical_entity: medical_entity?.uuid,
                    reset: true
                }).then(() => router.push('/'))
                break;
            case 'profile':
                await router.push("/dashboard/settings");
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
    }

    if (loading) return (<LoadingScreen button text={"loading-switch"}/>);

    return (
        <ProfileSectionStyled
            onClick={handleToggle}
            ref={anchorRef}
            id="composition-button"
            aria-controls={opened ? "composition-menu" : undefined}
            aria-expanded={opened ? "true" : undefined}
            aria-haspopup="true">
            <Stack direction={"row"} spacing={.5}>
                <Typography
                    color={"text.secondary"}>{general_information?.isProfessional ? "Dr" : ""} {general_information?.firstName} {general_information?.lastName}</Typography>
                <ExpandMore color={"text"}/>
            </Stack>
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
                                                <Avatar sx={{width: 28, height: 28}}
                                                        src={`/static/icons/${general_information?.gender !== "O" ?
                                                            "men" : "women"}-avatar.svg`}/>
                                                <Box className="profile-detail">
                                                    <Typography variant="body1" className="name" fontWeight={600}>
                                                        {session?.user && <> {roles.includes('ROLE_SECRETARY') ? "SECRÉTAIRE" : "DR"} {session.user.name?.toUpperCase()} </>}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        </MenuList>
                                    </MenuItem>
                                    <MenuItem
                                        className={`item-list`}
                                        disableRipple>
                                        <IconUrl path={"ic-world-language"}/>
                                        <Typography variant="body1" mr={1} ml={1.6} color={"text.secondary"}>
                                            {t("lang")}
                                        </Typography>
                                        <ToggleButtonGroup
                                            sx={{
                                                marginLeft: "auto"
                                            }}
                                            size={"small"}
                                            color="primary"
                                            value={locale}
                                            exclusive
                                            onChange={async (event, locale) => {
                                                const lang = locale.substring(0, 2);
                                                const dir = lang === 'ar' ? 'rtl' : 'ltr';
                                                router.replace(router.pathname, router.asPath, {locale: lang}).then(() => {
                                                    dispatch(setDirection(dir));
                                                    dispatch(setLocalization(locale));
                                                    moment.locale(lang === 'ar' ? 'ar-tn' : lang);
                                                });
                                            }}
                                            aria-label="Lang">
                                            {Object.entries(Langs).map((item) => (
                                                <ToggleButton onClick={() => handleClose(item[1])} key={item[1].locale}
                                                              value={item[0]}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 10,
                                                            fontWeight: "bold"
                                                        }}>{item[1].label}</Typography>
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    </MenuItem>
                                    {ProfileMenuConfig.map((item: any, index) => ((item.action === 'switch-medical-entity' && hasMultiMedicalEntities) || item.action !== 'switch-medical-entity') && (
                                        <ConditionalWrapper
                                            key={`menu-${index}`}
                                            condition={!!item?.feature}
                                            wrapper={(children: any) =>
                                                <Can I={"manage"} a={item.feature}>
                                                    {children}
                                                </Can>}>
                                            <MenuItem
                                                onClick={() => handleMenuItem(item.action)}
                                                disableRipple
                                                className={`item-list ${item.name === "Settings" ? "border-bottom" : ""
                                                }${item.hasOwnProperty("items") ? "has-items" : ""}`}>
                                                <IconUrl path={item.icon}/>
                                                <Typography variant="body1" className="item-name">
                                                    {t("doctor-dropdown." + item.name.toLowerCase())}
                                                </Typography>
                                            </MenuItem>
                                        </ConditionalWrapper>
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

export default ProfileMenu
