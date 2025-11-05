/*
 * @Author: Yixeu
 * @Date: 2021-11-05 16:31:01
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-21 01:33:42
 * @Description:
 */

interface TypeQueryList {
  pageNum: string | number;
  pageSize: string | number;
}

interface TypeQueryListByTime {
  cursorTime: string;
  pageSize: string | number;
}

export namespace TypeHomeAPI {
  interface APIGetArticleList extends TypeQueryList {
    order: number;
    scrollId: string;
    searchKey?: string;
  }
}

export namespace TypeOperateAPI {
  interface APIPostToLike {
    businessId: string;
    businessType: number;
    like: number;
  }

  interface APIPostToStar {
    businessId: string;
    businessType: number;
    fav: number;
  }
}

export namespace TypePersonalAPI {
  interface APIGetJoinArticleList extends TypeQueryList {}
  interface APIGetPublishArticleList extends TypeQueryList {}
  interface APIGetStarArticleList extends TypeQueryList {}
  interface APIPostVersion {
    currentVersion: number;
  }
}

export namespace TypeFunctionBarAPI {
  interface APIPublishPost {
    title: string;
    simpleContent: string;
    fullContent: string;
    picList: Array<string>;
    atUserList: Array<{ [key]: string }>;
  }
}

export namespace TypeAiteAPI {
  interface APISearchAitePerson {
    name: string;
  }

  interface APIGetArticleList extends TypeQueryList {
    order: number;
    scrollId: string;
    searchKey?: string;
  }
}

export namespace TypeOperateAPI {
  interface APIPostToLike {
    businessId: string;
    businessType: number;
    like: number;
  }

  interface APIPostToStar {
    businessId: string;
    businessType: number;
    fav: number;
  }
}

export namespace TypePersonalAPI {
  interface APIGetJoinArticleList extends TypeQueryListByTime {}
  interface APIGetPublishArticleList extends TypeQueryListByTime {}
  interface APIGetStarArticleList extends TypeQueryListByTime {}
}

export namespace TypeDetailAPI {
  interface APIGetArticleDetail {
    businessId: string;
  }
  interface APIGetArticleIndicator {
    businessId: string;
  }
  interface APIGetArticleComment extends TypeQueryList {
    articleBusinessId: string;
    order: number;
    scrollId: string;
  }

  interface APIGetCommentReply extends TypeQueryList {
    parentBusinessId: string;

    order: number;
    scrollId: string;
  }

  interface APIPostToComment {
    articleBusinessId: string;
    content: string;
    atUserList?: Array<any>;
  }

  interface APIPostToReply {
    articleBusinessId?: string;
    relationBusinessId?: string;
    content: string;
    parentBusinessId?: string;
    atUserList?: Array<{
      workCode: string;
      nickname: string;
    }>;
  }

  interface APIPostToDelete {
    businessId: string;
    businessType: 1 | 2;
  }
}

export namespace TypeGlobalSearchAPI {
  interface APISearchHistory {}
}

export namespace TypeMessageAPI {
  interface APIChangeConfig {
    atNotify: number;
    commentNotify: number;
    likeNotify: number;
    favNotify: number;
    notifyStrategy: number;
  }

  interface APIGetComment extends TypeQueryList {}
  interface APIGetFavor extends TypeQueryList {}
  interface APIGetReply extends TypeQueryList {}
  interface APIGetCollection extends TypeQueryList {}
}

export namespace TypeWxSignatureAPI {
  interface APIGetWxSignature {
    url: string;
  }
}

export namespace TypeOfficialAPI {
  interface APIOfficial {
    workCode: any;
  }
}
export namespace TypeBrowserNumberAPI {
  interface APIGETBrowserNumber {
    businessIdList: Array<string>;
  }
}
