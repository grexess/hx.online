// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "../../../../../covers"})]
  });
  