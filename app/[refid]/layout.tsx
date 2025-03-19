import React from 'react';

const Layout = (
    { children }: Readonly<{ children: React.ReactNode; }>
) => {
    return (
        <>
            <div className='flex flex-col gap-1.5 items-center justify-center bg-primary p-2.5'>
                <h1 className='text-5xl'>OmniSync</h1>
                <p>A universal clipboard for all devices.  abc</p>
            </div>
            {children}
        </>
    );
};

export default Layout;
