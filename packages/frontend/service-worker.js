const version = '0.0.1';

const main = async () => {
	console.log(`Service Worker ${version} is starting ...`);
};

const onInstall = async evt => {
	console.log(`Service Worker ${version} installed.`);
	self.skipWaiting();
};
const onActivate = async evt => {
	evt.waitUntil(handleActivation());
};

const onMessage = e => {
	if (e.data.updateSw) {
		self.skipWaiting();
	}
};

const handleActivation = async () => {
	await clients.claim();

	console.log(`Service Worker ${version} activated.`);
};

self.addEventListener('fetch', function (event) {
	// it can be empty if you just want to get rid of that error
});

main().catch(console.error);

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('message', onMessage);
