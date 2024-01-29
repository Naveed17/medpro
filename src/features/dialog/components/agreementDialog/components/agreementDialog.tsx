import {
  Stepper,
  stepperSelector,
  Insurance,
  Agreement,
} from "@features/stepper";
import { useAppSelector } from "@lib/redux/hooks";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { FormikProvider, useFormik, Form } from "formik";
import * as Yup from "yup";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
function AgreementDialog({ ...props }) {
  const {
    data: { t, devise, stepperData, collapse = false },
  } = props;
  const validationSchema = Yup.object().shape({
    select_insurance: Yup.string().required("requried"),
  });
  const formRef = useRef(null) as any;

  const handleSubmitThroughRef = () => {
    formRef.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const { currentStep } = useAppSelector(stepperSelector);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      selected: "insurance",
      insurance: {},
      agreement: {},
    },

    onSubmit: async (values) => {},
    validationSchema,
  });
  const { values, setFieldValue, handleSubmit, errors } = formik;
  return (
    <Stack>
      <Paper
        sx={{
          px: 2,
          py: 3,
          border: "none",
          borderRadius: 0,
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        <Stepper
          {...{ stepperData }}
          tabIndex={currentStep}
          t={t}
          minWidth={662}
          padding={0}
        />
      </Paper>
      <Paper
        sx={{ px: 2, py: 3, border: "none", mx: -3, mb: -2, borderRadius: 0 }}
      >
        <FormikProvider value={formik}>
          <Form
            autoComplete="off"
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              display={currentStep === 0 ? "flex" : "none"}
              mb={2}
            >
              {["insurance", "agreement"].map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 1,
                    cursor: "pointer",
                    borderColor:
                      values.selected === item ? "primary.main" : "divider",
                  }}
                  onClick={() => {
                    setFieldValue("selected", item);
                  }}
                >
                  <CardContent sx={{ "&:last-of-type": { pb: 2 } }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Radio
                        checked={values.selected === item ?? false}
                        sx={{ svg: { width: 24 } }}
                        checkedIcon={
                          <IconUrl path="ic-check-circle" width={24} />
                        }
                      />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {t(`dialog.stepper.${item}`)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            <Stack>
              <AnimatePresence mode="wait">
                {values.selected === "insurance" && (
                  <Insurance {...{ t, devise, formik, collapse }} />
                )}
                {values.selected === "agreement" && (
                  <Agreement {...{ t, devise, formik }} />
                )}
              </AnimatePresence>
            </Stack>
          </Form>
        </FormikProvider>
      </Paper>
    </Stack>
  );
}

export default AgreementDialog;
