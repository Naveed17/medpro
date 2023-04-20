import React, {useState} from "react";
import {Form, FormikProvider, useFormik} from "formik";
import RootStyled from "./overrides/rootStyle";
import {
    Box,
    Card,
    Checkbox,
    Collapse,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";

function AddNewRoleDialog({...props}) {
    const {
        data: {t, selected, setValues},
    } = props;
    const generateID = () => {
        return Math.random().toString(36).slice(2);
    };
    const uid = generateID();
    const [state, setState] = useState(
        selected
            ? selected.permissions
            : [
                {
                    id: 1,
                    label: "agenda_management",
                    value: false,
                    insideList: [
                        {
                            id: "01",
                            label: "add_appointment",
                            value: false,
                        },
                        {
                            id: "02",
                            label: "add_appointment",
                            value: false,
                            insideList: [
                                {
                                    id: "001",
                                    label: "add_appointment",
                                    value: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    label: "agenda_management",
                    value: false,
                    insideList: [
                        {
                            id: "01",
                            label: "add_appointment",
                            value: false,
                        },
                        {
                            id: "02",
                            label: "add_appointment",
                            value: false,
                            insideList: [
                                {
                                    id: "001",
                                    label: "add_appointment",
                                    value: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 3,
                    label: "agenda_management",
                    value: false,
                    insideList: [
                        {
                            id: "01",
                            label: "add_appointment",
                            value: false,
                        },
                        {
                            id: "02",
                            label: "add_appointment",
                            value: false,
                            insideList: [
                                {
                                    id: "001",
                                    label: "add_appointment",
                                    value: false,
                                },
                            ],
                        },
                    ],
                },
            ]
    );
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            role_name: selected ? selected.role_name : "",
            permissions: state,
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {getFieldProps, values, setFieldValue} = formik;

    function checkAllValuesTrue(obj: any) {
        if (obj.hasOwnProperty("value") && obj.value === false) {
            return false;
        }
        if (obj.hasOwnProperty("insideList")) {
            for (let i = 0; i < obj.insideList.length; i++) {
                if (!checkAllValuesTrue(obj.insideList[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    let allValuesTrue = true;
    for (let i = 0; i < values.permissions.length; i++) {
        if (!checkAllValuesTrue(values.permissions[i])) {
            allValuesTrue = false;
            break;
        }
    }
    const handleToggleAllSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const newPermissions = values.permissions.map((permission: any) => {
                permission.value = true;
                if (permission.insideList) {
                    permission.insideList = permission.insideList.map(
                        (insidePermission: any) => {
                            insidePermission.value = true;

                            if (insidePermission.insideList) {
                                insidePermission.insideList = insidePermission.insideList.map(
                                    (nestedPermission: any) => {
                                        nestedPermission.value = true;
                                        return nestedPermission;
                                    }
                                );
                            }

                            return insidePermission;
                        }
                    );
                }
                return permission;
            });
            setState(newPermissions);
        } else {
            const newPermissions = values.permissions.map((permission: any) => {
                permission.value = false;
                if (permission.insideList) {
                    permission.insideList = permission.insideList.map(
                        (insidePermission: any) => {
                            insidePermission.value = false;

                            if (insidePermission.insideList) {
                                insidePermission.insideList = insidePermission.insideList.map(
                                    (nestedPermission: any) => {
                                        nestedPermission.value = false;
                                        return nestedPermission;
                                    }
                                );
                            }

                            return insidePermission;
                        }
                    );
                }

                return permission;
            });

            setState(newPermissions);
        }
    };
    const handleCheckBox = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.target.checked) {
            const newPermissions = values.permissions.map(
                (permission: any, idx: number) => {
                    if (index === idx) {
                        permission.value = true;
                        permission.insideList = permission.insideList.map(
                            (insidePermission: any) => {
                                insidePermission.value = true;
                                if (insidePermission.insideList) {
                                    insidePermission.insideList = insidePermission.insideList.map(
                                        (nestedPermission: any) => {
                                            insidePermission.value = false;
                                            return nestedPermission;
                                        }
                                    );
                                }

                                return insidePermission;
                            }
                        );
                    }
                    return permission;
                }
            );
            setState(newPermissions);
        } else {
            const newPermissions = values.permissions.map(
                (permission: any, idx: any) => {
                    if (index === idx) {
                        permission.value = false;
                        permission.insideList = permission.insideList.map(
                            (insidePermission: any) => {
                                insidePermission.value = false;
                                if (insidePermission.insideList) {
                                    insidePermission.insideList = insidePermission.insideList.map(
                                        (nestedPermission: any) => {
                                            return nestedPermission;
                                        }
                                    );
                                }

                                return insidePermission;
                            }
                        );
                    }

                    return permission;
                }
            );
            setState(newPermissions);
        }
    };
    const handleCheckBoxInside = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        mainIndex: number
    ) => {
        if (e.target.checked) {
            const newPermissions = values.permissions.map(
                (permission: any, i: number) => {
                    if (i === mainIndex) {
                        permission.insideList = permission.insideList.map(
                            (insidePermission: any, idx: number) => {
                                if (idx === index) {
                                    insidePermission.value = true;
                                    if (insidePermission.insideList) {
                                        insidePermission.insideList =
                                            insidePermission.insideList.map(
                                                (nestedPermission: any) => {
                                                    nestedPermission.value = true;
                                                    return nestedPermission;
                                                }
                                            );
                                    }
                                }

                                return insidePermission;
                            }
                        );
                    }
                    return permission;
                }
            );
            setState(newPermissions);
        } else {
            const newPermissions = values.permissions.map(
                (permission: any, i: number) => {
                    if (i === mainIndex) {
                        permission.insideList = permission.insideList.map(
                            (insidePermission: any, idx: number) => {
                                if (idx === index) {
                                    insidePermission.value = false;
                                    if (insidePermission.insideList) {
                                        insidePermission.insideList =
                                            insidePermission.insideList.map(
                                                (nestedPermission: any) => {
                                                    nestedPermission.value = false;
                                                    return nestedPermission;
                                                }
                                            );
                                    }
                                }

                                return insidePermission;
                            }
                        );
                    }
                    return permission;
                }
            );
            setState(newPermissions);
        }
    };
    const getValues = () =>
        setValues({...values, id: selected ? selected.id : uid});
    React.useEffect(() => {
        getValues();
    }, [values]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <FormikProvider value={formik}>
                <Form noValidate>
                    <RootStyled spacing={2}>
                        <Stack>
                            <Typography gutterBottom textTransform="uppercase">
                                {t("role_name")}
                            </Typography>
                            <TextField
                                {...getFieldProps("role_name")}
                                placeholder={t("role_name")}
                            />
                        </Stack>
                        <Box className="permissions-wrapper">
                            <Typography gutterBottom>{t("select_permissions")}</Typography>
                            <Card>
                                <List sx={{p: 0}}>
                                    <ListItem>
                                        <FormControlLabel
                                            className="bold-label"
                                            control={<Checkbox onChange={handleToggleAllSelect}/>}
                                            label={t("select_all")}
                                            checked={allValuesTrue}
                                        />
                                    </ListItem>
                                    {values.permissions?.map((item: any, idx: number) => (
                                        <React.Fragment key={item.id}>
                                            <ListItem className="main-list">
                                                <FormControlLabel
                                                    className="bold-label"
                                                    control={
                                                        <Checkbox
                                                            onChange={(e) => handleCheckBox(e, idx)}
                                                            checked={item.value}
                                                        />
                                                    }
                                                    label={t(item.label)}
                                                />
                                                <IconButton
                                                    sx={{
                                                        ".react-svg": {
                                                            transform: item.value ? "scale(-1)" : "none",
                                                        },
                                                    }}
                                                    disableRipple
                                                    className="collapse-icon">
                                                    <IconUrl path="setting/ic-down-arrow"/>
                                                </IconButton>
                                            </ListItem>
                                            {item.insideList && (
                                                <Collapse in={item.value} className="inner-collapse">
                                                    <List className="inside-list">
                                                        {item.insideList.map(
                                                            (insideItem: any, i: number) => (
                                                                <React.Fragment key={insideItem.id}>
                                                                    <ListItem>
                                                                        <FormControlLabel
                                                                            className={
                                                                                insideItem.insideList
                                                                                    ? "bold-label"
                                                                                    : "simple-label"
                                                                            }
                                                                            control={
                                                                                <Checkbox
                                                                                    {...(!insideItem.insideList
                                                                                        ? getFieldProps(
                                                                                            `permissions[${idx}].insideList[${i}].value`
                                                                                        )
                                                                                        : {
                                                                                            onChange: (e) =>
                                                                                                handleCheckBoxInside(
                                                                                                    e,
                                                                                                    i,
                                                                                                    idx
                                                                                                ),
                                                                                        })}
                                                                                    checked={insideItem.value}
                                                                                />
                                                                            }
                                                                            label={t(insideItem.label)}
                                                                        />
                                                                        {insideItem.insideList && (
                                                                            <IconButton
                                                                                sx={{
                                                                                    ".react-svg": {
                                                                                        transform: insideItem.value
                                                                                            ? "scale(-1)"
                                                                                            : "none",
                                                                                    },
                                                                                }}
                                                                                disableRipple
                                                                                className="collapse-icon">
                                                                                <IconUrl path="setting/ic-down-arrow"/>
                                                                            </IconButton>
                                                                        )}
                                                                    </ListItem>
                                                                    {insideItem.insideList && (
                                                                        <Collapse in={insideItem.value}>
                                                                            <List className="inside-list">
                                                                                {insideItem.insideList.map(
                                                                                    (subItem: any, j: number) => (
                                                                                        <React.Fragment
                                                                                            key={subItem.id}>
                                                                                            <ListItem>
                                                                                                <FormControlLabel
                                                                                                    control={
                                                                                                        <Checkbox
                                                                                                            {...getFieldProps(
                                                                                                                `permissions[${idx}].insideList[${i}].insideList[${j}].value`
                                                                                                            )}
                                                                                                            checked={subItem.value}
                                                                                                        />
                                                                                                    }
                                                                                                    label={t(subItem.label)}
                                                                                                />
                                                                                            </ListItem>
                                                                                        </React.Fragment>
                                                                                    )
                                                                                )}
                                                                            </List>
                                                                        </Collapse>
                                                                    )}
                                                                </React.Fragment>
                                                            )
                                                        )}
                                                    </List>
                                                </Collapse>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Card>
                        </Box>
                    </RootStyled>
                </Form>
            </FormikProvider>
        </>
    );
}

export default AddNewRoleDialog;
