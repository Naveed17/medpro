import { Box, Divider, Stack, Typography, Collapse } from '@mui/material'
import RootStyled from './overrides/rootStyle'
function PdfTempleteTwo({ ...props }) {
    const { hide } = props
    return (
        <RootStyled>
            <Collapse in={!hide as boolean}>
                <Stack direction="row" justifyContent="space-between" mb={5}>
                    <Stack maxWidth={200} width={1}>
                        <Typography color="primary" variant='subtitle1' lineHeight={1.2}>Doctor Name</Typography>
                        <Typography color="primary" variant='subtitle1'>Specilalist</Typography>
                        <Divider sx={{ width: 1 }} />
                        <Typography color="primary" variant='subtitle2' my={.3}>Some Doctor Data </Typography>
                        <Divider sx={{ width: 1 }} />
                    </Stack>

                    <Stack maxWidth={150} width={1} alignItems="flex-end">
                        <Typography color="primary" variant='subtitle2' lineHeight={1.2}>Doctor Name</Typography>
                        <Typography color="primary" variant='subtitle2'>Specilalist</Typography>
                        <Divider sx={{ width: 1 }} />
                        <Typography color="primary" my={.3}>Tel:0000000000000</Typography>
                        <Typography color="primary" my={.3}>Tel:0000000000000</Typography>
                    </Stack>
                </Stack>
            </Collapse>
            <Typography textAlign="center" variant='h6'>Certificat Medical</Typography>
            <Stack direction='row' alignItems="flex-end" justifyContent="flex-end" mt={5}>
                <Typography>Tunis le:</Typography>
                <Box className='line' maxWidth={100} width={1}>
                    <Typography lineHeight={1}></Typography>
                </Box>
            </Stack>
            <Typography mt={6} sx={{ textIndent: 20 }}>
                Je soussignee,
                <Typography mx={.5} fontWeight={500} component="span" color="text.secondary">
                    Dr Nourane KRIAA
                </Typography>
                certifie
            </Typography>
            <Typography mt={2.5}>
                avoir exmaine ce jour :
            </Typography>
            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
            <Typography>
                et que son etat de sante necessite un repos
            </Typography>
            <Stack direction='row' alignItems="flex-end" mt={2.5}>
                <Typography>de</Typography>
                <Box className='line' maxWidth={100} width={1}>
                    <Typography lineHeight={1}></Typography>
                </Box>
                <Typography>jour(s) a compter de ce jour, sauf complications ulterieures</Typography>
            </Stack>
            <Stack mt={10} direction="row" justifyContent="flex-end">
                <Typography lineHeight={1} variant="caption">Signature et cachet de Medecin</Typography>
            </Stack>
        </RootStyled >
    )
}

export default PdfTempleteTwo