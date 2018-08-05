
export interface SignUpConfig {

    name: string;
    phone: string;
    password: string;
    device_type: string;
    device_token: null;
    device_id: null;
    country_code: string;
    isRajput: number;
    otp?: number;
    email?: string;
}


export interface SignUpLoginSubRes {
    id: number;
    name: string;
    email: null;
    phone: string;
    dob: string | null;
    occupation: string | null;
    profile_pic: string | null;
    agent_approved: string;
    gender: number;
    notification: number;
    subscription: 0 | 1;
    social_type: number;
    facebook_id?: string | null;
    facebook_token?: string | null;
    google_id: string | null;
    google_token?: string | null;
    father_name: string;
    native_village: string;
    maternal_home?: string;
    kul_gotra?: string;
    children?: string;
    business_achievments?: string,
    profile_pic_thumbnail: string;
    profile_pic_original: string;
    isVendor: 0 | 1;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    loginToken: string;
    business_id?: number;
    business_name?: string;
    business_approved?: number;
    business_slug?: string;
    country_code: any;
    membership_type?: number;
    membership_type_icon?: string;
    isRajput?: number;
    first_login?: number;
}

export interface SignUpLoginRes {
    status: 1 | 0;
    message: string;
    code?: string;
    data: SignUpLoginSubRes;
}

export interface LoginConfig {
    username: string;
    password: string;
    device_type: '1' | '2' | '3';
    device_token: null;
    device_id: null;
    social_type: null;
    social_token: null;
    country_code: string;
}

export interface RegBusinessConfig {
    name: string;
    mobile: string;
    address: string;
    email_id: string;
}

export interface BusinessFlag {
    is_Register: boolean;
    howManyTimes?: number;
    skipped: boolean;
    business_id?: number
    business_name?: string;
    business_approved?: number;
    business_slug?: string;
    country_code: any;
}

export interface UserProfile {

    business_achievments: string;
    children: string;
    dob: string | null;
    email: string | null;
    facebook_id: null;
    facebook_token: null;
    father_name: string;
    gender: 0 | 1 | 2 | 3;
    google_id: null;
    google_token: null;
    id: number;
    isVendor: number;
    kul_gotra: string;
    maternal_home: string;
    name: string;
    native_village: string;
    notification: number;
    occupation: string | null;
    phone: string;
    profile_pic: string | null;
    profile_pic_original: string;
    profile_pic_thumbnail: string;
    social_type: number;
    subscription: number;
    updated_at: string;
    created_at: string;
    deleted_at: string | null;
    country_code: any;
}

// export interface AuthTokenRes {
//     status: 0 | 1;
//     message: 'Invalid Token.' | 'Failed to validating token.' | 'Token Expired.';
// }


export interface CategorieMenu {
    category_id: number;
    category_slug: string;
    image_url: string;
    name: string;
    sub_category?: Array<CategorieMenu>;
}
export interface CategorieMenuRes {
    status: 0 | 1;
    message: string;
    data: Array<CategorieMenuRes>;
}

export interface TrendingServiceRes {
    status: 0 | 1;
    message: string;
    data: Array<CategoryDataRes>;
}
export interface CategoryDataRes {
    category_logo: string;
    category_name: string;
    category_slug: string;
    service_id?: number;
    category_id?: number;
    parent_category_id?: number;
    businesses?: Array<BusinessListDetails>;
}

export interface BusinessListDetails {
    address: string;
    business_image?: string;
    email_id?: string;
    id?: number;
    website_url?: string;
    business_slug: string;
    descriptions: string;
    latitude: string;
    longitude: string;
    mobile: string;
    name: string;
    phone: string;
    categories: Array<CategoryDataRes>;
}

export interface BusinessRes {
    status: 0 | 1;
    message: string;
    data: Array<BusinessListDetails>;
}

export interface InvestmentOpportunityRes {
    status: 0 | 1;
    message: string;
    loadMore?: number;
    data: Array<InvestmentOpportunityResData>;
}

export interface InvestmentOpportunityDetailRes {
    status: 0 | 1;
    message: string;
    loadMore?: number;
    data?: Array<InvestmentOpportunityResData>;
}

export interface InvestmentOpportunityResData {
    category_id: number;
    id: number;
    creator_name: string;
    creator_business_name: string;
    creator_business_original_image: string;
    creator_business_thumb_image: string;
    creator_email: string;
    category_name: string;
    creator_phone: string;
    creator_profile_pic: string;
    descriptions: string;
    investment_amount_start: string;
    investment_amount_end: string;
    location: string;
    project_duration: string;
    member_name: string;
    member_email: string;
    member_phone: string;
    offering_percent: string;
    title: string;
    title_slug: string;
    file_docs: Array<FileDocRes>;
    file_images: Array<FileImageRes>;
    file_videos: Array<FileVideoRes>;
    interests: Array<InterestsRes>;
}
export interface InterestsRes {
    descriptions: string;
    phone: string;
    profile_pic: string;
    user_name: string;
}
export interface FileVideoRes {
    id: number;
    thumbnail: string;
    url: string;
    video_id: string;
}
export interface FileImageRes {
    id: number;
    url: string;
}

export interface FileDocRes {
    id: number;
    name: string;
    url: string;
}

export interface PostJsonBusinessList {
    limit?: number;
    page?: number;
    sortBy?: string;
    category_slug?: string;
    radius?: number;
    latitude?: number;
    longitude?: number;
    searchText?: string;
}

export interface BusinessListDetailsRes {
    status: 0 | 1;
    message: string;
    data?: BusinessDetails;
}

export interface InvestmentListDetailsRes {
    status: 0 | 1;
    message: string;
    data?: InvestmentDetails;
}

export interface BusinessDetails {
    address: string;
    business_activities: Array<string>;
    business_images: Array<string>;
    business_slug: string;
    country: string | null;
    current_open_status: string;
    descriptions: string;
    email: string;
    id: number;
    latitude: string;
    longitude: string;
    mobile: string;
    name: string;
    phone: string;
    street_address: string;
    timings: string;
    website: string;
    year_of_establishment: string;
    owners: Array<OwnerRes>;
    products: Array<ProductsRes>;
    services: Array<ServicesRes>;
    social_profiles: Array<SocialProfilesRes>;
    rating: RatingRes;
    hoursOperation: Array<HoursOperationRes>;
    parent_category_name?: string;
    timezone?: string;
    user_id: number;
    created_by_agent?: number;
    membership_type?: number;
    membership_type_icon?: string;
    parent_categories?: Array<ParentCategoryRes>;
}

export interface InvestmentDetails {
    category_id: number;
    category_name: string;
    category_slug: string;
    creator_name: string;
    creator_profile_pic: string | null;
    descriptions: string;
    file_images: string;
    id: number;
    investment_amount_end: number;
    investment_amount_start: number;
    location: string | null;
    member_email: string;
    member_name: string;
    member_phone: string;
    offering_percent: string;
    project_duration?: string;
    title?: string;
    title_slug: string;
}

export interface ProductsRes {
    id: number;
    image_url: string;
    name: string;
}

export interface ServicesRes {
    id: number;
    image_url: string;
    name: string;
}

export interface OwnerRes {
    email: string;
    id: number;
    image_url: string;
    name: string;
    phone: string;
}

export interface SocialProfilesRes {
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
}

export interface RatingRes {
    avg_rating: number;
    start_1_rating: number;
    start_2_rating: number;
    start_3_rating: number;
    start_4_rating: number;
    start_5_rating: number;
    total: number;
    user_rating: string;
    reviews: Array<ReviewsRes>;
}

export interface ReviewsRes {
    id: number;
    image_url: string;
    name: string;
    rating: string;
    review: string;
    timestamp: string;
}

export interface ProductDetailRes {
    status: 0 | 1;
    message: string;
    data?: ProductDataRes;
}

export interface ProductDataRes {
    business_id: number;
    business_name: string;
    cost: string | null;
    descriptions: string;
    metatags: string;
    name: string;
    product_images: Array<string>;
}

export interface ServiceDetailRes {
    status: 0 | 1;
    message: string;
    data?: ServiceDataRes;
}

export interface ServiceDataRes {
    business_id: number;
    business_name: string;
    cost: string | null;
    descriptions: string;
    metatags: string;
    name: string;
    logo: string;
}

export interface BusinessRatingRes {
    status: 0 | 1;
    message: string;
    data?: RatingRes;
}

export interface HoursOperationRes {
    end_time: string,
    name: string,
    open_close: string,
    start_time: string
}

export interface marker {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
    business_slug?: string;
}

export interface ThreandListRes {
    status: 0 | 1;
    message: string;
    data: Array<ThreadUserRes>;
}

export interface ThreadUserRes {
    id: number;
    image_url: string;
    name: string;
    title: string;
    unread_count: string;
    last_message: Array<MessageRes>;
}

export interface MessageRes {
    id: number;
    message: string;
    timestamp: number;
}

export interface ThreadMessageListRes {
    status: 0 | 1;
    message: string;
    data: ThreadMessageRes;
}

export interface ThreadMessageRes {
    id: number;
    image_url: string;
    name: string;
    title: string;
    loadMore: number;
    messages: Array<MessageListRes>;
}

export interface MessageListRes {
    id: number;
    message: string;
    timestamp: number;
    posted_by: number;
}

// agent side received memeber data res
export interface MemberData {
    dob: string | null;
    email: string | null;
    gender: 0 | 1 | 2;
    id: number;
    name: string;
    phone: string;
    profile_pic: string;
}

export interface MemberDataRes {
    status: 0 | 1;
    message: string;
    data: MemberData;
}

export interface ParentCategoryRes {
    id: number;
    logo: string;
    name: string;
}

