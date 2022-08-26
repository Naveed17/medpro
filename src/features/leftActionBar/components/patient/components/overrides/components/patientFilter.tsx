import { Fragment, useRef, KeyboardEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@features/datepicker";
import _ from "lodash";
import { useIsMountedRef } from "@app/hooks";
interface StateProps {
  name: string;
  telephone: number | string;
  dob: Date | null;
  gender: string | null;
}
function PatientFilter({ ...props }) {
  const { item, t } = props;
  const router = useRouter();
  const { query } = router;
  const [state, setstate] = useState<StateProps>({
    name: "",
    telephone: "",
    dob: null,
    gender: null,
  });

  const isMounted = useIsMountedRef();

  useEffect(() => {
    if (isMounted.current) {
      setstate({ ...state, ...query });
    }
  }, [query, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {t(`${item.gender?.heading}`)}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="gender"
          onChange={(e) => {
            setstate({ ...state, gender: e.target.value });
            router.push({
              query: { ...router.query, gender: e.target.value },
            });
          }}
          value={state.gender}
          name="row-radio-buttons-group"
        >
          {item.gender?.genders.map((g: string, i: number) => (
            <FormControlLabel
              sx={{ ml: i === 1 ? "5px" : 0 }}
              key={`gender-${i}`}
              value={g}
              control={<Radio />}
              label={t(`${g}`)}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {item.textField?.labels.map(
        (
          lab: {
            label: string;
            placeholder: string;
          },
          i: number
        ) => (
          <Fragment key={`patient-filter-label-${i}`}>
            {lab.label === "name" || lab.label === "telephone" ? (
              <>
                <InputLabel shrink htmlFor={lab.label} sx={{ mt: 2 }}>
                  {t(`${lab.label}`)}
                </InputLabel>
                <TextField
                  onChange={(e) =>
                    setstate({ ...state, [lab.label]: e.target.value })
                  }
                  value={state[lab.label]}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      if ((e.target as HTMLInputElement).value) {
                        router.push({
                          query: {
                            ...router.query,
                            [lab.label]: (e.target as HTMLInputElement).value,
                          },
                        });
                      } else {
                        const query = _.omit(router.query, [lab.label]);
                        router.push({
                          query,
                        });
                      }
                    }
                  }}
                  type={lab.label === "name" ? "text" : "number"}
                  fullWidth
                  placeholder={t(`${lab.placeholder}`)}
                />
              </>
            ) : (
              <>
                <InputLabel shrink htmlFor={lab.label} sx={{ mt: 2 }}>
                  {t(`${lab.label}`)}
                </InputLabel>
                <DatePicker
                  value={state.dob}
                  onChange={(date: Date) => {
                    setstate({ ...state, dob: date });

                    if (date && date.toString() !== "Invalid Date") {
                      router.push({
                        query: {
                          ...router.query,
                          dob: new Date(date).toISOString().split("T")[0],
                        },
                      });
                    } else {
                      const query = _.omit(router.query, "dob");
                      router.push({
                        query,
                      });
                    }
                  }}
                />
              </>
            )}
          </Fragment>
        )
      )}
    </Box>
  );
}

export default PatientFilter;
