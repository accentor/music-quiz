import { ApiModule } from "./api_module";

const AccentorApi = {
  albums: new ApiModule("albums"),
  artists: new ApiModule("artists"),
  auth: new ApiModule("auth_tokens"),
  codec_conversion: new ApiModule("codec_conversions"),
  codecs: new ApiModule("codecs"),
  cover_filenames: new ApiModule("cover_filenames"),
  genres: new ApiModule("genres"),
  image_types: new ApiModule("image_types"),
  labels: new ApiModule("labels"),
  locations: new ApiModule("locations"),
  plays: new ApiModule("plays"),
  rescan: new ApiModule("rescan"),
  tracks: new ApiModule("tracks"),
  users: new ApiModule("users"),
};

export default AccentorApi;
