// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // RYEC_API_URL: 'http://local.ryec-backend.com/api/',
  RYEC_API_URL: 'http://ryecbackend.inexture.com/api/',
  // RYEC_API_URL: 'http://admin.ryuva.club/api/',
  NDA: 'No Data Available',
  GOOGLE_MAP_API: 'https://maps.google.com/maps/api/js?key=AIzaSyCTdAmyxsAISAcV_jnGdndkmaWGWI1J6to&libraries=places',
  BUSINESS_LIST_LIMIT: 10,
  LOCATION_RADIUS: 25,
  DESCRIPTIO_TRIM_LENGTH: 1000,
  RESEND_OTP_TIME: 120
};
