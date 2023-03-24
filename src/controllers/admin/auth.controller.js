const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const adminAuthService = require('../../services/adminAuth.service');
const tokenService = require('../../services/token.service');
const otpService= require('../../services/otp.service');

const signIn=catchAsync(async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const admin=await adminAuthService.adminSignin(email,password);
    const tokens = await tokenService.generateAuthTokens(admin);

    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'You have successfully logged in',
      },
      result: {
        userData: admin,
        tokens: {
          accessToken: tokens.access.token,
          refreshToken: tokens.refresh.token,
        },
      },
    });
})

const signOut = catchAsync(async (req, res) => {
    // console.log(req.body);
  await adminAuthService.adminSignOut(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'You have successfully logged out',
    }
});
});


// FORGET PASSWORD OTP GENERATE //
const forgotPasswordOtp = catchAsync(async(req, res) => {
  const user = await adminAuthService.getAdminByEmail(req.body.email,'admin');
  if (user) {
      const otp = await otpService.generateResetPasswordOTP(req.body.email, 'Your forgot password verification code is ');
      res.status(httpStatus.OK).send({
          serverResponse: {
              code: httpStatus.OK,
              message: 'Verification code has been sent to your email!',
          },
          result: {
            otp: otp
          }
      });
  } else {
      res.status(404).send({
          serverResponse: {
              code: 404,
              message: 'Invalid email ID',
          },
      });
  }
});

// USER OTP VERIFICATION //
const otpVerification = catchAsync(async(req, res) => {
  const { email, otp } = req.body;
  const otpVerify = await otpService.checkOtpVerifiaction(email, otp);
  if (otpVerify) {
      const data = { is_verify: true };
      const user = await adminAuthService.updateUserByEmail(email, data);
      const tokens = await tokenService.generateAuthTokens(user);
      res.status(httpStatus.OK).send({
          serverResponse: {
              code: httpStatus.OK,
              message: 'OTP verified Successfully',
          },
          result: {
              userData: user,
              tokens: {
                  accessToken: tokens.access.token,
                  refreshToken: tokens.refresh.token,
              },
          },
      });
  } else {
      res.status(401).send({
          serverResponse: {
              code: 401,
              message: 'OTP not verified, please try again!',
          },
      });
  }
});

const resetPassword = catchAsync(async(req, res) => {
//   console.log("body",req.body);
  const resetPass = await otpService.resetPassword(req.body.email, req.body.password);
  if (resetPass) {
      res.status(httpStatus.OK).send({
          serverResponse: {
              code: httpStatus.OK,
              message: 'Your password has been reset successfully.',
          },
      });
  } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
});
module.exports={
    signIn,
    signOut,
    forgotPasswordOtp,
    otpVerification,
    resetPassword
}