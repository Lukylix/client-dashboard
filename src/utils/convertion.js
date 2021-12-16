const getReadableSize = (bytes = 0) => {
	var sizes = [" B", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];

	for (var i = 1; i < sizes.length; i++) {
		if (bytes < Math.pow(1024, i)) return Math.round((bytes / Math.pow(1024, i - 1)) * 100) / 100 + sizes[i - 1];
	}
	return bytes;
};

module.exports = { getReadableSize };
