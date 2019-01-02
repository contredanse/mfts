import AppConfig from '@src/core/app-config';
import PageProxy, { PageProxyFactory } from '@src/models/proxy/page-proxy';
import { IJsonPage } from '@data/json/data-pages';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import VideoRepository from '@src/models/repository/video-repository';

export default class PageRepository {
    protected readonly pages: IJsonPage[];
    protected readonly config: AppConfig;
    protected readonly videoRepository: VideoRepository;

    constructor(config: AppConfig, pages: IJsonPage[], videoRepository: VideoRepository) {
        this.pages = pages;
        this.config = config;
        this.videoRepository = videoRepository;
    }

    getAllPages(): IJsonPage[] {
        return this.pages;
    }

    findPages(fragment: string, lang: DataSupportedLangType): IJsonPage[] {
        if (fragment === '') {
            return this.getAllPages();
        }
        const regex = new RegExp(fragment, 'i');
        return this.pages.filter((page: IJsonPage) => {
            const keywords = page.keywords[lang] || page.keywords[this.config.fallbackLang];
            if (keywords !== undefined) {
                return (
                    keywords
                        .join(' ')
                        .concat(page.title[lang])
                        .concat(page.content.layout || '')
                        .search(regex) > -1
                );
            }
            return false;
        });
    }

    getPage(pageId: string): IJsonPage | undefined {
        return this.pages.find((element: IJsonPage) => {
            return pageId === element.page_id;
        });
    }

    /**
     * Return page proxy
     */
    getPageProxy(pageId: string): PageProxy | undefined {
        const page = this.getPage(pageId);
        if (page === undefined) {
            return undefined;
        }
        return PageProxyFactory.createFromJson(page, this.videoRepository, {
            fallbackLang: this.config.fallbackLang,
            assetsLocator: this.config.assetsLocator,
        });
    }
}
