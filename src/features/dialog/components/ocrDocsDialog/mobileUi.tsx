import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import BorderLinearProgress from "@features/dialog/components/ocrDocsDialog/overrides/BorderLinearProgress";
import IconUrl from "@themes/urlIcon";
import React from "react";
import { InputStyled } from "@features/tabPanel";

function MobileUi({ ...props }) {
  const { files, handleDrop, handleDeleteDoc, t } = props;
  const theme = useTheme();
  return (
    <div>
      {files.length > 0 ? (
        <Stack>
          <Typography fontSize={14} fontWeight={600} mb={1}>
            Documents en cours de traitement
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.2}>
            {files.map((file: File, index: number) => (
              <Card key={index}>
                <CardContent>
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <IconUrl path={"ic-doc-upload"} />
                    <Stack
                      alignItems={"start"}
                      spacing={0.5}
                      sx={{ width: "75%" }}
                    >
                      <Typography fontSize={12} fontWeight={400}>
                        {file.name}
                      </Typography>
                      <BorderLinearProgress variant="determinate" value={30} />
                    </Stack>
                    <IconButton
                      onClick={() => handleDeleteDoc(index)}
                      disableRipple
                      sx={{ p: 0 }}
                    >
                      <IconUrl path="ic-close-btn" width={40} height={40} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Card
              sx={{
                backgroundColor: theme.palette.background.default,
                border: `1px dashed ${theme.palette.primary.main}`,
              }}
            >
              <CardContent>
                <label htmlFor="contained-button-file">
                  <InputStyled
                    id="contained-button-file"
                    onChange={(e) => handleDrop(e.target.files as FileList)}
                    type="file"
                    capture="user"
                  />
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <IconUrl
                      path={"add-doc"}
                      color={theme.palette.primary.main}
                    />
                    <Stack alignItems={"start"} alignContent={"center"}>
                      <Typography fontSize={12} fontWeight={400}>
                        {t("dialogs.add-dialog.scan-more")}
                      </Typography>
                      <Typography
                        color={"primary.main"}
                        fontSize={12}
                        fontWeight={500}
                      >
                        {t("dialogs.add-dialog.add-img-or-file")}
                      </Typography>
                    </Stack>
                  </Stack>
                </label>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={4} alignItems="center">
          <Box>
            <Typography
              component="h4"
              fontWeight={700}
              textAlign="center"
              fontSize={24}
            >
              {t("dialogs.add-dialog.scan-doc")}
            </Typography>
            <Typography variant="body2" textAlign="center" mt={1.2}>
              {t("dialogs.add-dialog.scan-doc-desc")}
            </Typography>
          </Box>
          <IconUrl path="ic-scan" />
          <Box alignSelf="flex-start">
            <Typography>{t("dialogs.add-dialog.list-title")}:</Typography>
            <List
              disablePadding
              sx={{ ".MuiListItemIcon-root": { minWidth: 20 } }}
            >
              <ListItem disablePadding>
                <ListItemIcon>
                  <IconUrl path="ic-check-filled" />
                </ListItemIcon>
                <ListItemText primary={t("dialogs.add-dialog.list-1")} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <IconUrl path="ic-check-filled" />
                </ListItemIcon>
                <ListItemText primary={t("dialogs.add-dialog.list-2")} />
              </ListItem>
            </List>
          </Box>
          <Button
            component="label"
            variant="contained"
            startIcon={<IconUrl path="ic-camera-outlined" />}
          >
            {t("scanner")}
            <InputStyled
              onChange={(e) => handleDrop(e.target.files as FileList)}
              type="file"
              capture="user"
             
            />
          </Button>
        </Stack>
      )}
    </div>
  );
}

export default MobileUi;
