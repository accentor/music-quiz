import {
  AuthTokenModule,
  CodecConversionModule,
  PlayModule,
  TrackModule,
} from "@accentor/api-client-js";
import baseURL from "./base_url";

const AccentorApi = {
  authTokens: new AuthTokenModule(baseURL),
  codecConversions: new CodecConversionModule(baseURL),
  plays: new PlayModule(baseURL),
  tracks: new TrackModule(baseURL),
};

export default AccentorApi;
