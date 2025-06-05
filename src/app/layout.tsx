import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { contentStyle, wrapperStyle } from 'app/page.style';
import './globals.css';
import AppFooter from 'components/AppFooter';
import AppHeader from 'components/AppHeader';
import { auth } from 'lib/auth';

export const metadata: Metadata = {
  title: 'Flower Shop - Купуй квіти, щоб радіти життю ще більше',
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ToastContainer theme='colored' />
          <div style={ wrapperStyle }>
            <AppHeader session={ session }/>
            <div style={ contentStyle }>
              <div>
                { children }
              </div>
            </div>
            <AppFooter/>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
