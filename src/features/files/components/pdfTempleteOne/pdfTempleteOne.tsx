import { Box, Divider, Stack, Typography, Collapse } from '@mui/material'
import RootStyled from './overrides/rootStyle'
function PdfTempleteOne({ ...props }) {
  const { hide } = props
  console.log(hide)
  return (
    <RootStyled>
      <Collapse in={hide as boolean}>
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
      <Stack direction='row' alignItems="flex-end" justifyContent="flex-end">
        <Typography>Tunis le:</Typography>
        <Box className='line' maxWidth={100} width={1}>
          <Typography lineHeight={1}></Typography>
        </Box>
      </Stack>
      <Typography variant='h6' my={7} textAlign='center'>Note d' honoraires</Typography>
      <Stack spacing={5}>
        <Stack direction="row" alignItems="flex-end">
          <Typography lineHeight={1} mr={.5}>Nom et Prenom du patient:</Typography>
          <Box className='line' width={'68.5%'}>
            <Typography lineHeight={1}></Typography>
          </Box>
        </Stack>
        <Box className='line' width={1}>
          <Typography lineHeight={1}></Typography>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="flex-start" mt={3.5}>
        <Typography lineHeight={1} mr={.5}>Honoraires</Typography>
        <Box width={1}
          className="multi-line">
          {
            Array.from({ length: 20 }).map((_, idx) =>
              <Stack direction="row" alignItems="flex-end" key={idx}>
                <Typography lineHeight={1} mr={.5} fontWeight={600}>:</Typography>
                <Box className='line' width={1}>
                  <Typography lineHeight={1}></Typography>
                </Box>
              </Stack>
            )
          }

        </Box>
      </Stack>
      <Stack mt={5} direction="row">
        <Box width={1} />
        <Typography lineHeight={1} mr={.5} fontWeight={600}>TOTAL:</Typography>
        <Box className='line' width={1}>
          <Typography lineHeight={1}></Typography>
        </Box>
      </Stack>
      <Stack mt={10} direction="row" justifyContent="flex-end">
        <Typography lineHeight={1} variant="caption">Signature et cachet de Medecin</Typography>
      </Stack>
    </RootStyled >
  )
}

export default PdfTempleteOne