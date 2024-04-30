import React from 'react';
import {Toaster} from 'react-hot-toast';
import {Rubik, Source_Code_Pro} from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import Layout from 'components/designSystem/Layout';
import {WalletContextApp} from '@builtbymom/web3/contexts/useWallet';
import {WithMom} from '@builtbymom/web3/contexts/WithMom';
import {localhost} from '@builtbymom/web3/utils/wagmi';
import {SafeProvider} from '@gnosis.pm/safe-apps-react-sdk';
import {IconCheck} from '@icons/IconCheck';
import {IconCircleCross} from '@icons/IconCircleCross';
import {useLocalStorageValue} from '@react-hookz/web';
import {supportedNetworks} from '@utils/tools.chains';
import {Analytics} from '@vercel/analytics/react';
import {FeebackPopover} from '@common/FeebackPopover';
import Meta from '@common/Meta';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '../style.css';

const rubik = Rubik({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--rubik-font'
});

const sourceCodePro = Source_Code_Pro({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--scp-font'
});

function MyApp(props: AppProps): ReactElement {
	const {value: shouldHidePopover} = useLocalStorageValue<boolean>('smoldapp/feedback-popover');

	return (
		<>
			<style
				jsx
				global>
				{`
					html {
						font-family: ${rubik.style.fontFamily}, ${sourceCodePro.style.fontFamily};
					}
				`}
			</style>
			<Toaster
				toastOptions={{
					duration: 5_000,
					className: 'toast',
					success: {
						icon: <IconCheck className={'-mr-1 size-5 min-h-5 min-w-5 pt-1.5'} />,
						iconTheme: {
							primary: 'black',
							secondary: '#F1EBD9'
						}
					},
					error: {
						icon: <IconCircleCross className={'-mr-1 size-5 min-h-5 min-w-5 pt-1.5'} />,
						iconTheme: {
							primary: 'black',
							secondary: '#F1EBD9'
						}
					}
				}}
				position={'top-right'}
			/>
			<WithMom
				supportedChains={[...supportedNetworks, localhost]}
				tokenLists={[
					'https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/tokenlistooor.json',
					'https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/defillama.json'
				]}>
				<WalletContextApp
					shouldWorkOnTestnet={
						process.env.NODE_ENV === 'development' && Boolean(process.env.SHOULD_USE_FORKNET)
					}>
					<SafeProvider>
						<PlausibleProvider
							domain={process.env.PLAUSIBLE_DOMAIN || 'smold.app'}
							enabled={true}>
							<main className={`flex h-app flex-col ${rubik.variable} ${sourceCodePro.variable}`}>
								<Meta />
								<Layout {...props} />
							</main>
							{!shouldHidePopover && <FeebackPopover />}
						</PlausibleProvider>
					</SafeProvider>
				</WalletContextApp>
			</WithMom>
			<Analytics />
		</>
	);
}

export default MyApp;