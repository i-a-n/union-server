// serve union.io "/" hard redirect

// serve union.io subdirectories
/*
 * /images/repo/* GET
 * -> ./symlink/images
 * /admin GET + password
 * /admin/images GET + password
 * -> ./symlink/admin
 */

// upload API
/*
 * /admin/upload POST + password
 * -> mime type on files (jpg, jpeg, gif, mp4, png, svg)
 * -> rename + file extension
 * -> thumbnail?
 * -> move to ./symlinks/images
 * /admin/images/files GET
 * -> number of files
 * -> last 10 filenames returned
 * /admin/images/files/10
 * -> returns filenames 10-20
 * /admin/images/files/20/30
 * -> returns filenames 20-50
 */
