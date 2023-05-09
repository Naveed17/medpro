import React, { useState,useEffect } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import RootStyled from "./overrides/rootStyle";
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Collapse,
  Switch,
  DialogActions,
  Button
} from "@mui/material";
import { IconButton } from "@mui/material";
import IconClose from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import { useSession } from "next-auth/react";
import { useRequestMutation,useRequest } from "@app/axios";
import { Session } from "next-auth";
import {useRouter} from "next/router";
import { LoadingButton } from "@mui/lab";
function AddNewRoleDialog({ ...props }) {
  const {data: { t, selected,handleMutate,handleVisitor,handleClose }} = props;
    const [loading, setLoading] = useState(false);
   const { data: session } = useSession();
   const router = useRouter();
    const { data: userSession } = session as Session;
  const medical_entity = (userSession as UserDataResponse)
    .medical_entity as MedicalEntityModel;
    const {trigger} = useRequestMutation(null, "/profile");

  const [permissions, setPermissions] = useState<any>(null);
   const { data: httpPermissionsResponse}= useRequest({
    method: "GET",
    url: "/api/medical-entity/permissions",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  useEffect(() => {
        if (httpPermissionsResponse){
           const response = (httpPermissionsResponse as HttpResponse)?.data
           const permissions = response.map((item: any) => {
            return {
              ...item,
              value: false,
              children: item.children.map((child: any) => {
                return {
                  ...child,
                  value: false,
                }
              })
            };
          });
          setPermissions(permissions);
        }
           
    }, [httpPermissionsResponse]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role_name: selected ? selected?.name : "",
      description: selected ? selected?.description : "",
      is_standard: selected ? selected?.is_standard ?? true : true,
      permissions,
    },
    onSubmit: async (values) => {
    setLoading(true);
    // get all the permissions uuid which are checked
    const checkedPermissions = [];
    for (let i = 0; i < values.permissions?.length; i++) {
      if (values.permissions[i].value && values.permissions[i].children.length === 0) {
        checkedPermissions.push(values.permissions[i].uuid);
      }
      if (values.permissions[i].children.length > 0) {
        for (let j = 0; j < values.permissions[i].children.length; j++) {
          if (values.permissions[i].children[j].value) {
            checkedPermissions.push(values.permissions[i].children[j].uuid);
          }
        }
      }
      
    }
      const form = new FormData();
      form.append("name", values.role_name);
      form.append("description", values.description);
      form.append("is_standard ", values.is_standard.toString());
      form.append("permissions", JSON.stringify(checkedPermissions.join(",")));
      if(selected){
           trigger({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/profile/${selected.uuid}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
          handleMutate();
          handleVisitor((prev:boolean) => !prev);
           setLoading(false)
        })
      }else{
        trigger({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/profile`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
          handleMutate();
          handleVisitor((prev:boolean) => !prev);
           setLoading(false)
        })
      }
     
    },
  });

  const { getFieldProps, values, setFieldValue } = formik;

  function checkAllValuesTrue(obj: any) {
    if (obj.hasOwnProperty("value") && obj.value === false) {
      return false;
    }
    if (obj.hasOwnProperty("children")) {
      for (let i = 0; i < obj.children.length; i++) {
        if (!checkAllValuesTrue(obj.children[i])) {
          return false;
        }
      }
    }
    return true;
  }
  let allValuesTrue = true;
  if(httpPermissionsResponse){
  for (let i = 0; i < values.permissions?.length; i++) {
    if (!checkAllValuesTrue(values.permissions[i])) {
      allValuesTrue = false;
      break;
    }
  }
  }
  const handleToggleAllSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newPermissions = values.permissions.map((permission: any) => {
        permission.value = true;
        if (permission.children) {
          permission.children = permission.children.map(
            (insidePermission: any) => {
              insidePermission.value = true;
              return insidePermission;
            }
          );
        }
        return permission;
      });
      setPermissions(newPermissions);
    } else {
      const newPermissions = values.permissions.map((permission: any) => {
        permission.value = false;
        if (permission.children) {
          permission.children = permission.children.map(
            (insidePermission: any) => {
              insidePermission.value = false;

              if (insidePermission.children) {
                insidePermission.children = insidePermission.children.map(
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

      setPermissions(newPermissions);
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
            permission.children = permission.children.map(
              (insidePermission: any) => {
                insidePermission.value = true;
                if (insidePermission.children) {
                  insidePermission.children = insidePermission.children.map(
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
      setPermissions(newPermissions);
    } else {
      const newPermissions = values.permissions.map(
        (permission: any, idx: any) => {
          if (index === idx) {
            permission.value = false;
            permission.children = permission.children.map(
              (insidePermission: any) => {
                insidePermission.value = false;
                if (insidePermission.children) {
                  insidePermission.children = insidePermission.children.map(
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
      setPermissions(newPermissions);
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
            permission.children = permission.children.map(
              (insidePermission: any, idx: number) => {
                if (idx === index) {
                  insidePermission.value = true;
                  if (insidePermission.children) {
                    insidePermission.children =
                      insidePermission.children.map(
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
      setPermissions(newPermissions);
    } else {
      const newPermissions = values.permissions.map(
        (permission: any, i: number) => {
          if (i === mainIndex) {
            permission.children = permission.children.map(
              (insidePermission: any, idx: number) => {
                if (idx === index) {
                  insidePermission.value = false;
                  if (insidePermission.children) {
                    insidePermission.children =
                      insidePermission.children.map(
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
      setPermissions(newPermissions);
    }
  };
  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate>
          <RootStyled spacing={2} height={400} overflow='scroll' pt={2}>
            <Stack spacing={2}>
              <Typography gutterBottom textTransform="uppercase">
                {t("role_name")}
              </Typography>
              <TextField
                {...getFieldProps("role_name")}
                placeholder={t("role_name")}
              />
               <Typography gutterBottom textTransform="uppercase">
                {t("description")}
              </Typography>
              <TextField
                {...getFieldProps("description")}
                placeholder={t("description_placeholder")}
                multiline
                rows={4}
              />
              <FormControlLabel control={<Switch {...getFieldProps("is_standard")} checked={values.is_standard} />}  label={t("is_standard")} />
            </Stack>
            <Box className="permissions-wrapper">
              <Typography gutterBottom>{t("select_permissions")}</Typography>
              <Card>
                <List sx={{ p: 0 }}>
                  <ListItem>
                    <FormControlLabel
                      className="bold-label"
                      control={<Checkbox onChange={handleToggleAllSelect} />}
                      label={t("select_all")}
                      checked={allValuesTrue}
                    />
                  </ListItem>
                  {values.permissions?.map((item: any, idx: number) => (
                    <React.Fragment key={item.uuid}>
                      <ListItem className="main-list">
                        <FormControlLabel
                        {
                          ...(item.children && {
                            className: item.children.length > 0 ? "bold-label" : "simple-label",
                          })
                        }
                          
                          control={
                            <Checkbox
                              onChange={(e) => handleCheckBox(e, idx)}
                              checked={item.value}
                            />
                          }
                          label={t("permissions." + item.slug)}
                        />
                        <IconButton
                          sx={{
                            ".react-svg": {
                              transform: item.value ? "scale(-1)" : "none",
                            },
                          }}
                          disableRipple
                          className="collapse-icon">
                          <IconUrl path="setting/ic-down-arrow" width={12} height={12} />
                        </IconButton>
                      </ListItem>
                      {item.children && (
                        <Collapse in={item.value} className="inner-collapse">
                          <List className="inside-list">
                            {item.children.map(
                              (insideItem: any, i: number) => (
                                <React.Fragment key={insideItem.uuid}>
                                  <ListItem>
                                    <FormControlLabel
                                    {...(insideItem.children && {
                                      className: "bold-label",
                                    })}
                              
                                      control={
                                        <Checkbox
                                          {...(!insideItem.children
                                            ? getFieldProps(
                                                `permissions[${idx}].children[${i}].value`
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
                                      label={t("permissions." + insideItem.slug)}
                                    />
                                   
                                  </ListItem>
                                  
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
        
            <Stack
              p={1}
              direction="row"
              spacing={2}
              borderTop={1}
              borderColor="divider"
              ml={-3}
              mr={-3}
              mt={2}
              justifyContent="flex-end">
              <Button
              onClick={()=>handleClose()}
                variant="text-black"
                startIcon={<IconClose />}>
                {t("cancel")}
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                startIcon={<IconUrl path="ic-dowlaodfile" />}>
                {t("save")}
              </LoadingButton>
            </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}

export default AddNewRoleDialog;
